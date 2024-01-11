"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGrayscaleImage = void 0;
const storedPixelDataToCanvasImageData_1 = __importDefault(require("./storedPixelDataToCanvasImageData"));
const storedPixelDataToCanvasImageDataPET_1 = __importDefault(require("./storedPixelDataToCanvasImageDataPET"));
const storedPixelDataToCanvasImageDataRGBA_1 = __importDefault(require("./storedPixelDataToCanvasImageDataRGBA"));
const setToPixelCoordinateSystem_1 = __importDefault(require("./setToPixelCoordinateSystem"));
const now_1 = __importDefault(require("./now"));
const getLut_1 = __importDefault(require("./getLut"));
const doesImageNeedToBeRendered_1 = __importDefault(require("./doesImageNeedToBeRendered"));
const initializeRenderCanvas_1 = __importDefault(require("./initializeRenderCanvas"));
const saveLastRendered_1 = __importDefault(require("./saveLastRendered"));
function getRenderCanvas(enabledElement, image, invalidated, useAlphaChannel = true) {
    const canvasWasColor = enabledElement.renderingTools.lastRenderedIsColor === true;
    if (!enabledElement.renderingTools.renderCanvas || canvasWasColor) {
        enabledElement.renderingTools.renderCanvas =
            document.createElement('canvas');
        (0, initializeRenderCanvas_1.default)(enabledElement, image);
    }
    const renderCanvas = enabledElement.renderingTools.renderCanvas;
    if ((0, doesImageNeedToBeRendered_1.default)(enabledElement, image) === false &&
        invalidated !== true) {
        return renderCanvas;
    }
    if (renderCanvas.width !== image.width ||
        renderCanvas.height !== image.height) {
        (0, initializeRenderCanvas_1.default)(enabledElement, image);
    }
    image.stats = image.stats || {};
    const renderCanvasData = enabledElement.renderingTools.renderCanvasData;
    const renderCanvasContext = enabledElement.renderingTools.renderCanvasContext;
    let start = (0, now_1.default)();
    image.stats.lastLutGenerateTime = (0, now_1.default)() - start;
    const { viewport } = enabledElement;
    if (viewport.modality === 'PT' && image.isPreScaled) {
        const { windowWidth, windowCenter } = viewport.voi;
        const minimum = windowCenter - windowWidth / 2;
        const maximum = windowCenter + windowWidth / 2;
        const range = maximum - minimum;
        const collectedMultiplierTerms = 255.0 / range;
        let petVOILutFunction;
        if (viewport.invert) {
            petVOILutFunction = (value) => 255 - (value - minimum) * collectedMultiplierTerms;
        }
        else {
            petVOILutFunction = (value) => (value - minimum) * collectedMultiplierTerms;
        }
        (0, storedPixelDataToCanvasImageDataPET_1.default)(image, petVOILutFunction, renderCanvasData.data);
    }
    else {
        const lut = (0, getLut_1.default)(image, viewport, invalidated);
        if (useAlphaChannel) {
            (0, storedPixelDataToCanvasImageData_1.default)(image, lut, renderCanvasData.data);
        }
        else {
            (0, storedPixelDataToCanvasImageDataRGBA_1.default)(image, lut, renderCanvasData.data);
        }
    }
    start = (0, now_1.default)();
    renderCanvasContext.putImageData(renderCanvasData, 0, 0);
    image.stats.lastPutImageDataTime = (0, now_1.default)() - start;
    return renderCanvas;
}
function renderGrayscaleImage(enabledElement, invalidated) {
    if (enabledElement === undefined) {
        throw new Error('drawImage: enabledElement parameter must not be undefined');
    }
    const image = enabledElement.image;
    if (image === undefined) {
        throw new Error('drawImage: image must be loaded before it can be drawn');
    }
    const context = enabledElement.canvas.getContext('2d');
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = 'black';
    context.fillRect(0, 0, enabledElement.canvas.width, enabledElement.canvas.height);
    context.imageSmoothingEnabled = !enabledElement.viewport.pixelReplication;
    (0, setToPixelCoordinateSystem_1.default)(enabledElement, context);
    const renderCanvas = getRenderCanvas(enabledElement, image, invalidated);
    const sx = enabledElement.viewport.displayedArea.tlhc.x - 1;
    const sy = enabledElement.viewport.displayedArea.tlhc.y - 1;
    const width = enabledElement.viewport.displayedArea.brhc.x - sx;
    const height = enabledElement.viewport.displayedArea.brhc.y - sy;
    context.drawImage(renderCanvas, sx, sy, width, height, 0, 0, width, height);
    enabledElement.renderingTools = (0, saveLastRendered_1.default)(enabledElement);
}
exports.renderGrayscaleImage = renderGrayscaleImage;
//# sourceMappingURL=renderGrayscaleImage.js.map