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
const getOrCreateCanvas_1 = __importStar(require("../RenderingEngine/helpers/getOrCreateCanvas"));
const enums_1 = require("../enums");
const getRenderingEngine_1 = require("../RenderingEngine/getRenderingEngine");
const RenderingEngine_1 = __importDefault(require("../RenderingEngine"));
const isPTPrescaledWithSUV_1 = __importDefault(require("./isPTPrescaledWithSUV"));
function renderToCanvasGPU(canvas, imageOrVolume, modality = undefined, renderingEngineId = '_thumbnails', viewportOptions = {
    displayArea: { imageArea: [1, 1] },
}) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('canvas element is required');
    }
    const isVolume = !imageOrVolume.imageId;
    const image = !isVolume && imageOrVolume;
    const volume = isVolume && imageOrVolume;
    const imageIdToPrint = (image === null || image === void 0 ? void 0 : image.imageId) || (volume === null || volume === void 0 ? void 0 : volume.volumeId);
    const viewportId = `renderGPUViewport-${imageIdToPrint}`;
    const element = document.createElement('div');
    const devicePixelRatio = window.devicePixelRatio || 1;
    if (!viewportOptions.displayArea) {
        viewportOptions.displayArea = { imageArea: [1, 1] };
    }
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    element.style.width = `${originalWidth / devicePixelRatio + getOrCreateCanvas_1.EPSILON}px`;
    element.style.height = `${originalHeight / devicePixelRatio + getOrCreateCanvas_1.EPSILON}px`;
    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    document.body.appendChild(element);
    const uniqueId = viewportId.split(':').join('-');
    element.setAttribute('viewport-id-for-remove', uniqueId);
    const temporaryCanvas = (0, getOrCreateCanvas_1.default)(element);
    const renderingEngine = (0, getRenderingEngine_1.getRenderingEngine)(renderingEngineId) ||
        new RenderingEngine_1.default(renderingEngineId);
    let viewport = renderingEngine.getViewport(viewportId);
    if (!viewport) {
        const viewportInput = {
            viewportId,
            type: isVolume ? enums_1.ViewportType.ORTHOGRAPHIC : enums_1.ViewportType.STACK,
            element,
            defaultOptions: Object.assign(Object.assign({}, viewportOptions), { suppressEvents: true }),
        };
        renderingEngine.enableElement(viewportInput);
        viewport = renderingEngine.getViewport(viewportId);
    }
    return new Promise((resolve) => {
        let elementRendered = false;
        let { viewReference } = viewportOptions;
        const onImageRendered = (eventDetail) => {
            if (elementRendered) {
                return;
            }
            if (viewReference) {
                const useViewRef = viewReference;
                viewReference = null;
                viewport.setViewReference(useViewRef);
                viewport.render();
                return;
            }
            const context = canvas.getContext('2d');
            context.drawImage(temporaryCanvas, 0, 0, temporaryCanvas.width, temporaryCanvas.height, 0, 0, canvas.width, canvas.height);
            const origin = viewport.canvasToWorld([0, 0]);
            const topRight = viewport.canvasToWorld([
                temporaryCanvas.width / devicePixelRatio,
                0,
            ]);
            const bottomLeft = viewport.canvasToWorld([
                0,
                temporaryCanvas.height / devicePixelRatio,
            ]);
            const thicknessMm = 1;
            elementRendered = true;
            element.removeEventListener(enums_1.Events.IMAGE_RENDERED, onImageRendered);
            setTimeout(() => {
                renderingEngine.disableElement(viewportId);
                const elements = document.querySelectorAll(`[viewport-id-for-remove="${uniqueId}"]`);
                elements.forEach((element) => {
                    element.remove();
                });
            }, 0);
            resolve({
                origin,
                bottomLeft,
                topRight,
                thicknessMm,
            });
        };
        element.addEventListener(enums_1.Events.IMAGE_RENDERED, onImageRendered);
        if (isVolume) {
            viewport.setVolumes([volume], false, true);
        }
        else {
            viewport.renderImageObject(imageOrVolume);
        }
        viewport.resetCamera();
        if (modality === 'PT' && !(0, isPTPrescaledWithSUV_1.default)(image)) {
            viewport.setProperties({
                voiRange: {
                    lower: image.minPixelValue,
                    upper: image.maxPixelValue,
                },
            });
        }
        viewport.render();
    });
}
exports.default = renderToCanvasGPU;
//# sourceMappingURL=renderToCanvasGPU.js.map