"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageLoader_1 = require("../loaders/imageLoader");
const metaData = __importStar(require("../metaData"));
const enums_1 = require("../enums");
const imageLoadPoolManager_1 = __importDefault(require("../requestPool/imageLoadPoolManager"));
const renderToCanvasGPU_1 = __importDefault(require("./renderToCanvasGPU"));
const renderToCanvasCPU_1 = __importDefault(require("./renderToCanvasCPU"));
const init_1 = require("../init");
const cache_1 = __importDefault(require("../cache"));
function loadImageToCanvas(options) {
    const { canvas, imageId, viewReference, requestType = enums_1.RequestType.Thumbnail, priority = -5, renderingEngineId = '_thumbnails', useCPURendering = false, thumbnail = false, imageAspect = false, viewportOptions: baseViewportOptions, } = options;
    const volumeId = viewReference === null || viewReference === void 0 ? void 0 : viewReference.volumeId;
    const isVolume = volumeId && !imageId;
    const viewportOptions = viewReference && baseViewportOptions
        ? Object.assign(Object.assign({}, baseViewportOptions), { viewReference }) : baseViewportOptions;
    const renderFn = useCPURendering ? renderToCanvasCPU_1.default : renderToCanvasGPU_1.default;
    return new Promise((resolve, reject) => {
        function successCallback(imageOrVolume, imageId) {
            var _a;
            const { modality } = metaData.get('generalSeriesModule', imageId) || {};
            const image = !isVolume && imageOrVolume;
            const volume = isVolume && imageOrVolume;
            if (image) {
                image.isPreScaled = image.isPreScaled || ((_a = image.preScale) === null || _a === void 0 ? void 0 : _a.scaled);
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
            return (0, imageLoader_1.loadAndCacheImage)(imageId, options).then((image) => {
                successCallback.call(this, image, imageId);
            }, (error) => {
                errorCallback.call(this, error, imageId);
            });
        }
        const { useNorm16Texture } = (0, init_1.getConfiguration)().rendering;
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
            const volume = cache_1.default.getVolume(volumeId);
            if (!volume) {
                reject(new Error(`Volume id ${volumeId} not found in cache`));
            }
            const useImageId = volume.imageIds[0];
            successCallback(volume, useImageId);
        }
        else {
            imageLoadPoolManager_1.default.addRequest(sendRequest.bind(null, imageId, null, options), requestType, { imageId }, priority);
        }
    });
}
exports.default = loadImageToCanvas;
//# sourceMappingURL=loadImageToCanvas.js.map