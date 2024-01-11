import now from './now';
import generateColorLUT from './generateColorLUT';
import storedColorPixelDataToCanvasImageData from './storedColorPixelDataToCanvasImageData';
import storedRGBAPixelDataToCanvasImageData from './storedRGBAPixelDataToCanvasImageData';
import setToPixelCoordinateSystem from './setToPixelCoordinateSystem';
import doesImageNeedToBeRendered from './doesImageNeedToBeRendered';
import initializeRenderCanvas from './initializeRenderCanvas';
import saveLastRendered from './saveLastRendered';
function getLut(image, viewport) {
    if (image.cachedLut !== undefined &&
        image.cachedLut.windowCenter === viewport.voi.windowCenter &&
        image.cachedLut.windowWidth === viewport.voi.windowWidth &&
        image.cachedLut.invert === viewport.invert) {
        return image.cachedLut.lutArray;
    }
    generateColorLUT(image, viewport.voi.windowWidth, viewport.voi.windowCenter, viewport.invert);
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
    if (doesImageNeedToBeRendered(enabledElement, image) === false &&
        invalidated !== true) {
        return renderCanvas;
    }
    if (renderCanvas.width !== image.width ||
        renderCanvas.height !== image.height) {
        initializeRenderCanvas(enabledElement, image);
    }
    let start = now();
    const colorLUT = getLut(image, enabledElement.viewport);
    image.stats = image.stats || {};
    image.stats.lastLutGenerateTime = now() - start;
    const renderCanvasData = enabledElement.renderingTools.renderCanvasData;
    const renderCanvasContext = enabledElement.renderingTools.renderCanvasContext;
    if (image.rgba) {
        storedRGBAPixelDataToCanvasImageData(image, colorLUT, renderCanvasData.data);
    }
    else {
        storedColorPixelDataToCanvasImageData(image, colorLUT, renderCanvasData.data);
    }
    start = now();
    renderCanvasContext.putImageData(renderCanvasData, 0, 0);
    image.stats.lastPutImageDataTime = now() - start;
    return renderCanvas;
}
export function renderColorImage(enabledElement, invalidated) {
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
    setToPixelCoordinateSystem(enabledElement, context);
    const renderCanvas = getRenderCanvas(enabledElement, image, invalidated);
    const sx = enabledElement.viewport.displayedArea.tlhc.x - 1;
    const sy = enabledElement.viewport.displayedArea.tlhc.y - 1;
    const width = enabledElement.viewport.displayedArea.brhc.x - sx;
    const height = enabledElement.viewport.displayedArea.brhc.y - sy;
    context.drawImage(renderCanvas, sx, sy, width, height, 0, 0, width, height);
    enabledElement.renderingTools = saveLastRendered(enabledElement);
}
//# sourceMappingURL=renderColorImage.js.map