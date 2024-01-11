"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgressive = exports.ProgressiveRetrieveImages = exports.singleRetrieveStages = exports.interleavedRetrieveStages = exports.sequentialRetrieveStages = void 0;
const singleRetrieve_1 = __importDefault(require("./configuration/singleRetrieve"));
exports.singleRetrieveStages = singleRetrieve_1.default;
const sequentialRetrieve_1 = __importDefault(require("./configuration/sequentialRetrieve"));
exports.sequentialRetrieveStages = sequentialRetrieve_1.default;
const interleavedRetrieve_1 = __importDefault(require("./configuration/interleavedRetrieve"));
exports.interleavedRetrieveStages = interleavedRetrieve_1.default;
const imageLoader_1 = require("./imageLoader");
const utilities_1 = require("../utilities");
const imageLoadPoolManager_1 = __importDefault(require("../requestPool/imageLoadPoolManager"));
const enums_1 = require("../enums");
const cache_1 = __importDefault(require("../cache"));
const eventTarget_1 = __importDefault(require("../eventTarget"));
const fillNearbyFrames_1 = require("./fillNearbyFrames");
class ProgressiveRetrieveImages {
    constructor(imageRetrieveConfiguration) {
        this.stages = imageRetrieveConfiguration.stages || singleRetrieve_1.default;
        this.retrieveOptions = imageRetrieveConfiguration.retrieveOptions || {};
    }
    loadImages(imageIds, listener) {
        const instance = new ProgressiveRetrieveImagesInstance(this, imageIds, listener);
        return instance.loadImages();
    }
}
exports.ProgressiveRetrieveImages = ProgressiveRetrieveImages;
ProgressiveRetrieveImages.createProgressive = createProgressive;
ProgressiveRetrieveImages.interleavedRetrieveStages = {
    stages: interleavedRetrieve_1.default,
};
ProgressiveRetrieveImages.singleRetrieveStages = {
    stages: singleRetrieve_1.default,
};
ProgressiveRetrieveImages.sequentialRetrieveStages = {
    stages: sequentialRetrieve_1.default,
};
class ProgressiveRetrieveImagesInstance {
    constructor(configuration, imageIds, listener) {
        this.outstandingRequests = 0;
        this.stageStatusMap = new Map();
        this.imageQualityStatusMap = new Map();
        this.displayedIterator = new utilities_1.ProgressiveIterator('displayed');
        this.stages = configuration.stages;
        this.retrieveOptions = configuration.retrieveOptions;
        this.imageIds = imageIds;
        this.listener = listener;
    }
    loadImages() {
        return __awaiter(this, void 0, void 0, function* () {
            const interleaved = this.createStageRequests();
            this.outstandingRequests = interleaved.length;
            for (const request of interleaved) {
                this.addRequest(request);
            }
            if (this.outstandingRequests === 0) {
                return Promise.resolve(null);
            }
            return this.displayedIterator.getDonePromise();
        });
    }
    sendRequest(request, options) {
        const { imageId, next } = request;
        const errorCallback = (reason, done) => {
            this.listener.errorCallback(imageId, complete || !next, reason);
            if (done) {
                this.updateStageStatus(request.stage, reason);
            }
        };
        const loadedPromise = (options.loader || imageLoader_1.loadAndCacheImage)(imageId, options);
        const uncompressedIterator = utilities_1.ProgressiveIterator.as(loadedPromise);
        let complete = false;
        uncompressedIterator
            .forEach((image, done) => __awaiter(this, void 0, void 0, function* () {
            const oldStatus = this.imageQualityStatusMap.get(imageId);
            if (!image) {
                console.warn('No image retrieved', imageId);
                return;
            }
            const { imageQualityStatus } = image;
            complete || (complete = imageQualityStatus === enums_1.ImageQualityStatus.FULL_RESOLUTION);
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
            (0, fillNearbyFrames_1.fillNearbyFrames)(this.listener, this.imageQualityStatusMap, request, image, options);
        }), errorCallback)
            .finally(() => {
            if (!complete && next) {
                if (cache_1.default.getImageLoadObject(imageId)) {
                    cache_1.default.removeImageLoadObject(imageId);
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
        var _a;
        const { imageId, stage } = request;
        const baseOptions = this.listener.getLoaderImageOptions(imageId);
        if (!baseOptions) {
            return;
        }
        const { retrieveType = 'default' } = stage;
        const { retrieveOptions: keyedRetrieveOptions } = this;
        const retrieveOptions = keyedRetrieveOptions[retrieveType] || keyedRetrieveOptions.default;
        const options = Object.assign(Object.assign({}, baseOptions), { retrieveType,
            retrieveOptions,
            streamingData });
        const priority = (_a = stage.priority) !== null && _a !== void 0 ? _a : -5;
        const requestType = stage.requestType || enums_1.RequestType.Interaction;
        const additionalDetails = { imageId };
        imageLoadPoolManager_1.default.addRequest(this.sendRequest.bind(this, request, options), requestType, additionalDetails, priority);
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
            (0, utilities_1.triggerEvent)(eventTarget_1.default, enums_1.Events.IMAGE_RETRIEVAL_STAGE, detail);
            this.stageStatusMap.delete(id);
        }
    }
    createStageRequests() {
        var _a;
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
                (0, utilities_1.decimate)(this.imageIds, stage.decimate || 1, (_a = stage.offset) !== null && _a !== void 0 ? _a : 0);
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
function createProgressive(configuration) {
    return new ProgressiveRetrieveImages(configuration);
}
exports.createProgressive = createProgressive;
exports.default = ProgressiveRetrieveImages;
//# sourceMappingURL=ProgressiveRetrieveImages.js.map