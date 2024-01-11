"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderColorImage = void 0;
const now_1 = __importDefault(require("./now"));
const generateColorLUT_1 = __importDefault(require("./generateColorLUT"));
const storedColorPixelDataToCanvasImageData_1 = __importDefault(require("./storedColorPixelDataToCanvasImageData"));
const storedRGBAPixelDataToCanvasImageData_1 = __importDefault(require("./storedRGBAPixelDataToCanvasImageData"));
const setToPixelCoordinateSystem_1 = __importDefault(require("./setToPixelCoordinateSystem"));
const doesImageNeedToBeRendered_1 = __importDefault(require("./doesImageNeedToBeRendered"));
const initializeRenderCanvas_1 = __importDefault(require("./initializeRenderCanvas"));
const saveLastRendered_1 = __importDefault(require("./saveLastRendered"));
function getLut(image, viewport) {
    if (image.cachedLut !== undefined &&
        image.cachedLut.windowCenter === viewport.voi.windowCenter &&
        image.cachedLut.windowWidth === viewport.voi.windowWidth &&
        image.cachedLut.invert === viewport.invert) {
        return image.cachedLut.lutArray;
    }
    (0, generateColorLUT_1.default)(image, viewport.voi.windowWidth, viewport.voi.windowCenter, viewport.invert);
    image.cachedLut.windowWidth = viewport.voi.windowWidth;
    image.cachedLut.windowCenter = viewport.voi.windowCenter;
    image.cachedLut.invert = viewport.invert;
    return image.cachedLut.lutArray;
}
function getRenderCanvas(enabledElement, image, invalidated) {
    const canvasWasColor = enabledElement.renderingTools.lastRenderedIsColor === true;
    if (!enabledElement.renderingTools.renderCanvas || !canvasWasColor) {
        enabledElement.renderingTools.renderCanvas =
            document.createElement('canvas');
    }
    const renderCanvas = enabledElement.renderingTools.renderCanvas;
    const { windowWidth, windowCenter } = enabledElement.viewport.voi;
    if ((windowWidth === 256 || windowWidth === 255) &&
        (windowCenter === 128 || windowCenter === 127) &&
        enabledElement.viewport.invert === false &&
        image.getCanvas &&
        image.getCanvas()) {
        return image.getCanvas();
    }
    if ((0, doesImageNeedToBeRendered_1.default)(enabledElement, image) === false &&
        invalidated !== true) {
        return renderCanvas;
    }
    if (renderCanvas.width !== image.width ||
        renderCanvas.height !== image.height) {
        (0, initializeRenderCanvas_1.default)(enabledElement, image);
    }
    let start = (0, now_1.default)();
    const colorLUT = getLut(image, enabledElement.viewport);
    image.stats = image.stats || {};
    image.stats.lastLutGenerateTime = (0, now_1.default)() - start;
    const renderCanvasData = enabledElement.renderingTools.renderCanvasData;
    const renderCanvasContext = enabledElement.renderingTools.renderCanvasContext;
    if (image.rgba) {
        (0, storedRGBAPixelDataToCanvasImageData_1.default)(image, colorLUT, renderCanvasData.data);
    }
    else {
        (0, storedColorPixelDataToCanvasImageData_1.default)(image, colorLUT, renderCanvasData.data);
    }
    start = (0, now_1.default)();
    renderCanvasContext.putImageData(renderCanvasData, 0, 0);
    image.stats.lastPutImageDataTime = (0, now_1.default)() - start;
    return renderCanvas;
}
function renderColorImage(enabledElement, invalidated) {
    if (enabledElement === undefined) {
        throw new Error('renderColorImage: enabledElement parameter must not be undefined');
    }
    const image = enabledElement.image;
    if (image === undefined) {
        throw new Error('renderColorImage: image must be loaded before it can be drawn');
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
exports.renderColorImage = renderColorImage;
//# sourceMappingURL=renderColorImage.js.map