"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getOrCreateCanvas_1 = __importDefault(require("../RenderingEngine/helpers/getOrCreateCanvas"));
const enums_1 = require("../enums");
const getRenderingEngine_1 = require("../RenderingEngine/getRenderingEngine");
const RenderingEngine_1 = __importDefault(require("../RenderingEngine"));
const isPTPrescaledWithSUV_1 = __importDefault(require("./isPTPrescaledWithSUV"));
function renderToCanvasGPU(canvas, image, modality = undefined, renderingEngineId = '_thumbnails') {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('canvas element is required');
    }
    const imageIdToPrint = image.imageId;
    const viewportId = `renderGPUViewport-${imageIdToPrint}`;
    const imageId = image.imageId;
    const element = document.createElement('div');
    element.style.width = `${canvas.width}px`;
    element.style.height = `${canvas.height}px`;
    element.style.visibility = 'hidden';
    element.style.position = 'absolute';
    const devicePixelRatio = window.devicePixelRatio || 1;
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    canvas.width = originalWidth * devicePixelRatio;
    canvas.height = originalHeight * devicePixelRatio;
    canvas.style.width = `${originalWidth}px`;
    canvas.style.height = `${originalHeight}px`;
    document.body.appendChild(element);
    const uniqueId = viewportId.split(':').join('-');
    element.setAttribute('viewport-id-for-remove', uniqueId);
    const renderingEngine = (0, getRenderingEngine_1.getRenderingEngine)(renderingEngineId) ||
        new RenderingEngine_1.default(renderingEngineId);
    let viewport = renderingEngine.getViewport(viewportId);
    if (!viewport) {
        const stackViewportInput = {
            viewportId,
            type: enums_1.ViewportType.STACK,
            element,
            defaultOptions: {
                suppressEvents: true,
            },
        };
        renderingEngine.enableElement(stackViewportInput);
        viewport = renderingEngine.getViewport(viewportId);
    }
    return new Promise((resolve) => {
        let elementRendered = false;
        const onImageRendered = (eventDetail) => {
            if (elementRendered) {
                return;
            }
            const temporaryCanvas = (0, getOrCreateCanvas_1.default)(element);
            const context = canvas.getContext('2d');
            context.drawImage(temporaryCanvas, 0, 0, temporaryCanvas.width, temporaryCanvas.height, 0, 0, canvas.width, canvas.height);
            elementRendered = true;
            element.removeEventListener(enums_1.Events.IMAGE_RENDERED, onImageRendered);
            setTimeout(() => {
                renderingEngine.disableElement(viewportId);
                const elements = document.querySelectorAll(`[viewport-id-for-remove="${uniqueId}"]`);
                elements.forEach((element) => {
                    element.remove();
                });
            }, 0);
            resolve(imageId);
        };
        element.addEventListener(enums_1.Events.IMAGE_RENDERED, onImageRendered);
        viewport.renderImageObject(image);
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