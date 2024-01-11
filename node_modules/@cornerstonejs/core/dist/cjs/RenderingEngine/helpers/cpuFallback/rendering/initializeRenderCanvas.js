"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(enabledElement, image) {
    const renderCanvas = enabledElement.renderingTools.renderCanvas;
    renderCanvas.width = image.width;
    renderCanvas.height = image.height;
    const canvasContext = renderCanvas.getContext('2d');
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, renderCanvas.width, renderCanvas.height);
    const renderCanvasData = canvasContext.getImageData(0, 0, image.width, image.height);
    enabledElement.renderingTools.renderCanvasContext = canvasContext;
    enabledElement.renderingTools.renderCanvasData = renderCanvasData;
}
exports.default = default_1;
//# sourceMappingURL=initializeRenderCanvas.js.map