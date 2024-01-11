import singleRetrieveStages from './configuration/singleRetrieve';
import sequentialRetrieveStages from './configuration/sequentialRetrieve';
import interleavedRetrieveStages from './configuration/interleavedRetrieve';
import { loadAndCacheImage } from './imageLoader';
import { triggerEvent, ProgressiveIterator, decimate } from '../utilities';
import imageLoadPoolManager from '../requestPool/imageLoadPoolManager';
import { ImageQualityStatus, RequestType, Events } from '../enums';
import cache from '../cache';
import eventTarget from '../eventTarget';
import { fillNearbyFrames } from './fillNearbyFrames';
export { sequentialRetrieveStages, interleavedRetrieveStages, singleRetrieveStages, };
export class ProgressiveRetrieveImages {
    constructor(imageRetrieveConfiguration) {
        this.stages = imageRetrieveConfiguration.stages || singleRetrieveStages;
        this.retrieveOptions = imageRetrieveConfiguration.retrieveOptions || {};
    }
    static { this.createProgressive = createProgressive; }
    static { this.interleavedRetrieveStages = {
        stages: interleavedRetrieveStages,
    }; }
    static { this.singleRetrieveStages = {
        stages: singleRetrieveStages,
    }; }
    static { this.sequentialRetrieveStages = {
        stages: sequentialRetrieveStages,
    }; }
    loadImages(imageIds, listener) {
        const instance = new ProgressiveRetrieveImagesInstance(this, imageIds, listener);
        return instance.loadImages();
    }
}
class ProgressiveRetrieveImagesInstance {
    constructor(configuration, imageIds, listener) {
        this.outstandingRequests = 0;
        this.stageStatusMap = new Map();
        this.imageQualityStatusMap = new Map();
        this.displayedIterator = new ProgressiveIterator('displayed');
        this.stages = configuration.stages;
        this.retrieveOptions = configuration.retrieveOptions;
        this.imageIds = imageIds;
        this.listener = listener;
    }
    async loadImages() {
        const interleaved = this.createStageRequests();
        this.outstandingRequests = interleaved.length;
        for (const request of interleaved) {
            this.addRequest(request);
        }
        if (this.outstandingRequests === 0) {
            return Promise.resolve(null);
        }
        return this.displayedIterator.getDonePromise();
    }
    sendRequest(request, options) {
        const { imageId, next } = request;
        const errorCallback = (reason, done) => {
            this.listener.errorCallback(imageId, complete || !next, reason);
            if (done) {
                this.updateStageStatus(request.stage, reason);
            }
        };
        const loadedPromise = (options.loader || loadAndCacheImage)(imageId, options);
        const uncompressedIterator = ProgressiveIterator.as(loadedPromise);
        let complete = false;
        uncompressedIterator
            .forEach(async (image, done) => {
            const oldStatus = this.imageQualityStatusMap.get(imageId);
            if (!image) {
                console.warn('No image retrieved', imageId);
                return;
            }
            const { imageQualityStatus } = image;
            complete ||= imageQualityStatus === ImageQualityStatus.FULL_RESOLUTION;
            if (oldStatus !== undefined && oldStatus > imageQualityStatus) {
                this.updateStageStatus(request.stage, null, true);
                return;
            }
            this.listener.successCallback(imageId, image);
            this.imageQualityStatusMap.set(imageId, imageQualityStatus);
            this.displayedIterator.add(image);
            if (done) {
                this.updateStageStatus(request.stage);
            }
            fillNearbyFrames(this.listener, this.imageQualityStatusMap, request, image, options);
        }, errorCallback)
            .finally(() => {
            if (!complete && next) {
                if (cache.getImageLoadObject(imageId)) {
                    cache.removeImageLoadObject(imageId);
                }
                this.addRequest(next, options.streamingData);
            }
            else {
                if (!complete) {
                    this.listener.errorCallback(imageId, true, "Couldn't decode");
                }
                this.outstandingRequests--;
                for (let skip = next; skip; skip = skip.next) {
                    this.updateStageStatus(skip.stage, null, true);
                }
            }
            if (this.outstandingRequests <= 0) {
                this.displayedIterator.resolve();
            }
        });
        const doneLoad = uncompressedIterator.getDonePromise();
        return doneLoad.catch((e) => null);
    }
    addRequest(request, streamingData = {}) {
        const { imageId, stage } = request;
        const baseOptions = this.listener.getLoaderImageOptions(imageId);
        if (!baseOptions) {
            return;
        }
        const { retrieveType = 'default' } = stage;
        const { retrieveOptions: keyedRetrieveOptions } = this;
        const retrieveOptions = keyedRetrieveOptions[retrieveType] || keyedRetrieveOptions.default;
        const options = {
            ...baseOptions,
            retrieveType,
            retrieveOptions,
            streamingData,
        };
        const priority = stage.priority ?? -5;
        const requestType = stage.requestType || RequestType.Interaction;
        const additionalDetails = { imageId };
        imageLoadPoolManager.addRequest(this.sendRequest.bind(this, request, options), requestType, additionalDetails, priority);
    }
    updateStageStatus(stage, failure, skipped = false) {
        const { id } = stage;
        const stageStatus = this.stageStatusMap.get(id);
        if (!stageStatus) {
            return;
        }
        stageStatus.imageLoadPendingCount--;
        if (failure) {
            stageStatus.imageLoadFailedCount++;
        }
        else if (!skipped) {
            stageStatus.totalImageCount++;
        }
        if (!skipped && !stageStatus.stageStartTime) {
            stageStatus.stageStartTime = Date.now();
        }
        if (!stageStatus.imageLoadPendingCount) {
            const { imageLoadFailedCount: numberOfFailures, totalImageCount: numberOfImages, stageStartTime = Date.now(), startTime, } = stageStatus;
            const detail = {
                stageId: id,
                numberOfFailures,
                numberOfImages,
                stageDurationInMS: stageStartTime ? Date.now() - stageStartTime : null,
                startDurationInMS: Date.now() - startTime,
            };
            triggerEvent(eventTarget, Events.IMAGE_RETRIEVAL_STAGE, detail);
            this.stageStatusMap.delete(id);
        }
    }
    createStageRequests() {
        const interleaved = new Array();
        const imageRequests = new Map();
        const addStageInstance = (stage, position) => {
            const index = position < 0
                ? this.imageIds.length + position
                : position < 1
                    ? Math.floor((this.imageIds.length - 1) * position)
                    : position;
            const imageId = this.imageIds[index];
            if (!imageId) {
                throw new Error(`No value found to add to requests at ${position}`);
            }
            const request = {
                imageId,
                stage,
                nearbyRequests: this.findNearbyRequests(index, stage),
            };
            this.addStageStatus(stage);
            const existingRequest = imageRequests.get(imageId);
            if (existingRequest) {
                existingRequest.next = request;
            }
            else {
                interleaved.push(request);
            }
            imageRequests.set(imageId, request);
        };
        for (const stage of this.stages) {
            const indices = stage.positions ||
                decimate(this.imageIds, stage.decimate || 1, stage.offset ?? 0);
            indices.forEach((index) => addStageInstance(stage, index));
        }
        return interleaved;
    }
    findNearbyRequests(index, stage) {
        const nearby = new Array();
        if (!stage.nearbyFrames) {
            return nearby;
        }
        for (const nearbyItem of stage.nearbyFrames) {
            const nearbyIndex = index + nearbyItem.offset;
            if (nearbyIndex < 0 || nearbyIndex >= this.imageIds.length) {
                continue;
            }
            nearby.push({
                itemId: this.imageIds[nearbyIndex],
                imageQualityStatus: nearbyItem.imageQualityStatus,
            });
        }
        return nearby;
    }
    addStageStatus(stage) {
        const { id } = stage;
        const stageStatus = this.stageStatusMap.get(id) || {
            stageId: id,
            startTime: Date.now(),
            stageStartTime: null,
            totalImageCount: 0,
            imageLoadFailedCount: 0,
            imageLoadPendingCount: 0,
        };
        stageStatus.imageLoadPendingCount++;
        this.stageStatusMap.set(id, stageStatus);
        return stageStatus;
    }
}
export function createProgressive(configuration) {
    return new ProgressiveRetrieveImages(configuration);
}
export default ProgressiveRetrieveImages;
//# sourceMappingURL=ProgressiveRetrieveImages.js.map