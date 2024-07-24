import { loadAndCacheImage } from '../loaders/imageLoader';
import * as metaData from '../metaData';
import { RequestType } from '../enums';
import imageLoadPoolManager from '../requestPool/imageLoadPoolManager';
import renderToCanvasGPU from './renderToCanvasGPU';
import renderToCanvasCPU from './renderToCanvasCPU';
import { getConfiguration } from '../init';
import cache from '../cache';
export default function loadImageToCanvas(options) {
    const { canvas, imageId, viewReference, requestType = RequestType.Thumbnail, priority = -5, renderingEngineId = '_thumbnails', useCPURendering = false, thumbnail = false, imageAspect = false, viewportOptions: baseViewportOptions, } = options;
    const volumeId = viewReference?.volumeId;
    const isVolume = volumeId && !imageId;
    const viewportOptions = viewReference && baseViewportOptions
        ? { ...baseViewportOptions, viewReference }
        : baseViewportOptions;
    const renderFn = useCPURendering ? renderToCanvasCPU : renderToCanvasGPU;
    return new Promise((resolve, reject) => {
        function successCallback(imageOrVolume, imageId) {
            const { modality } = metaData.get('generalSeriesModule', imageId) || {};
            const image = !isVolume && imageOrVolume;
            const volume = isVolume && imageOrVolume;
            if (image) {
                image.isPreScaled = image.isPreScaled || image.preScale?.scaled;
            }
            if (thumbnail) {
                canvas.height = 256;
                canvas.width = 256;
            }
            if (imageAspect && image) {
                canvas.width = image && (canvas.height * image.width) / image.height;
            }
            canvas.style.width = `${canvas.width / devicePixelRatio}px`;
            canvas.style.height = `${canvas.height / devicePixelRatio}px`;
            if (volume && useCPURendering) {
                reject(new Error('CPU rendering of volume not supported'));
            }
            renderFn(canvas, imageOrVolume, modality, renderingEngineId, viewportOptions).then(resolve);
        }
        function errorCallback(error, imageId) {
            console.error(error, imageId);
            reject(error);
        }
        function sendRequest(imageId, imageIdIndex, options) {
            return loadAndCacheImage(imageId, options).then((image) => {
                successCallback.call(this, image, imageId);
            }, (error) => {
                errorCallback.call(this, error, imageId);
            });
        }
        const { useNorm16Texture } = getConfiguration().rendering;
        const options = {
            targetBuffer: {
                type: useNorm16Texture ? undefined : 'Float32Array',
            },
            preScale: {
                enabled: true,
            },
            useRGBA: !!useCPURendering,
            requestType,
        };
        if (volumeId) {
            const volume = cache.getVolume(volumeId);
            if (!volume) {
                reject(new Error(`Volume id ${volumeId} not found in cache`));
            }
            const useImageId = volume.imageIds[0];
            successCallback(volume, useImageId);
        }
        else {
            imageLoadPoolManager.addRequest(sendRequest.bind(null, imageId, null, options), requestType, { imageId }, priority);
        }
    });
}
//# sourceMappingURL=loadImageToCanvas.js.map