import { loadAndCacheImage } from '../loaders/imageLoader';
import * as metaData from '../metaData';
import { RequestType } from '../enums';
import imageLoadPoolManager from '../requestPool/imageLoadPoolManager';
import renderToCanvasGPU from './renderToCanvasGPU';
import renderToCanvasCPU from './renderToCanvasCPU';
import { getConfiguration } from '../init';
export default function loadImageToCanvas(options) {
    const { canvas, imageId, requestType = RequestType.Thumbnail, priority = -5, renderingEngineId = '_thumbnails', useCPURendering = false, } = options;
    const renderFn = useCPURendering ? renderToCanvasCPU : renderToCanvasGPU;
    return new Promise((resolve, reject) => {
        function successCallback(image, imageId) {
            const { modality } = metaData.get('generalSeriesModule', imageId) || {};
            image.isPreScaled = image.isPreScaled || image.preScale?.scaled;
            renderFn(canvas, image, modality, renderingEngineId).then(() => {
                resolve(imageId);
            });
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
        imageLoadPoolManager.addRequest(sendRequest.bind(null, imageId, null, options), requestType, { imageId }, priority);
    });
}
//# sourceMappingURL=loadImageToCanvas.js.map