"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fitToWindow_1 = __importDefault(require("./fitToWindow"));
const getImageSize_1 = __importDefault(require("./getImageSize"));
function setCanvasSize(enabledElement) {
    const { canvas } = enabledElement;
    const { clientWidth, clientHeight } = canvas;
    if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
        canvas.width = clientWidth;
        canvas.height = clientHeight;
    }
}
function wasFitToWindow(enabledElement, oldCanvasWidth, oldCanvasHeight) {
    const scale = enabledElement.viewport.scale;
    const imageSize = (0, getImageSize_1.default)(enabledElement.image, enabledElement.viewport.rotation);
    const imageWidth = Math.round(imageSize.width * scale);
    const imageHeight = Math.round(imageSize.height * scale);
    const x = enabledElement.viewport.translation.x;
    const y = enabledElement.viewport.translation.y;
    return ((imageWidth === oldCanvasWidth && imageHeight <= oldCanvasHeight) ||
        (imageWidth <= oldCanvasWidth &&
            imageHeight === oldCanvasHeight &&
            x === 0 &&
            y === 0));
}
function relativeRescale(enabledElement, oldCanvasWidth, oldCanvasHeight) {
    const scale = enabledElement.viewport.scale;
    const canvasWidth = enabledElement.canvas.width;
    const canvasHeight = enabledElement.canvas.height;
    const relWidthChange = canvasWidth / oldCanvasWidth;
    const relHeightChange = canvasHeight / oldCanvasHeight;
    const relChange = Math.sqrt(relWidthChange * relHeightChange);
    enabledElement.viewport.scale = relChange * scale;
}
function default_1(enabledElement, forceFitToWindow = false) {
    const oldCanvasWidth = enabledElement.canvas.width;
    const oldCanvasHeight = enabledElement.canvas.height;
    setCanvasSize(enabledElement);
    if (enabledElement.image === undefined) {
        return;
    }
    if (forceFitToWindow ||
        wasFitToWindow(enabledElement, oldCanvasWidth, oldCanvasHeight)) {
        (0, fitToWindow_1.default)(enabledElement);
    }
    else {
        relativeRescale(enabledElement, oldCanvasWidth, oldCanvasHeight);
    }
}
exports.default = default_1;
//# sourceMappingURL=resize.js.map