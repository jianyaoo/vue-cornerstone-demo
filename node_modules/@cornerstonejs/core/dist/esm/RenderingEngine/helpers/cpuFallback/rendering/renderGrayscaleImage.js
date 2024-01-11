import storedPixelDataToCanvasImageData from './storedPixelDataToCanvasImageData';
import storedPixelDataToCanvasImageDataPET from './storedPixelDataToCanvasImageDataPET';
import storedPixelDataToCanvasImageDataRGBA from './storedPixelDataToCanvasImageDataRGBA';
import setToPixelCoordinateSystem from './setToPixelCoordinateSystem';
import now from './now';
import getLut from './getLut';
import doesImageNeedToBeRendered from './doesImageNeedToBeRendered';
import initializeRenderCanvas from './initializeRenderCanvas';
import saveLastRendered from './saveLastRendered';
function getRenderCanvas(enabledElement, image, invalidated, useAlphaChannel = true) {
    const canvasWasColor = enabledElement.renderingTools.lastRenderedIsColor === true;
    if (!enabledElement.renderingTools.renderCanvas || canvasWasColor) {
        enabledElement.renderingTools.renderCanvas =
            document.createElement('canvas');
        initializeRenderCanvas(enabledElement, image);
    }
    const renderCanvas = enabledElement.renderingTools.renderCanvas;
    if (doesImageNeedToBeRendered(enabledElement, image) === false &&
        invalidated !== true) {
        return renderCanvas;
    }
    if (renderCanvas.width !== image.width ||
        renderCanvas.height !== image.height) {
        initializeRenderCanvas(enabledElement, image);
    }
    image.stats = image.stats || {};
    const renderCanvasData = enabledElement.renderingTools.renderCanvasData;
    const renderCanvasContext = enabledElement.renderingTools.renderCanvasContext;
    let start = now();
    image.stats.lastLutGenerateTime = now() - start;
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
        storedPixelDataToCanvasImageDataPET(image, petVOILutFunction, renderCanvasData.data);
    }
    else {
        const lut = getLut(image, viewport, invalidated);
        if (useAlphaChannel) {
            storedPixelDataToCanvasImageData(image, lut, renderCanvasData.data);
        }
        else {
            storedPixelDataToCanvasImageDataRGBA(image, lut, renderCanvasData.data);
        }
    }
    start = now();
    renderCanvasContext.putImageData(renderCanvasData, 0, 0);
    image.stats.lastPutImageDataTime = now() - start;
    return renderCanvas;
}
export function renderGrayscaleImage(enabledElement, invalidated) {
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
    setToPixelCoordinateSystem(enabledElement, context);
    const renderCanvas = getRenderCanvas(enabledElement, image, invalidated);
    const sx = enabledElement.viewport.displayedArea.tlhc.x - 1;
    const sy = enabledElement.viewport.displayedArea.tlhc.y - 1;
    const width = enabledElement.viewport.displayedArea.brhc.x - sx;
    const height = enabledElement.viewport.displayedArea.brhc.y - sy;
    context.drawImage(renderCanvas, sx, sy, width, height, 0, 0, width, height);
    enabledElement.renderingTools = saveLastRendered(enabledElement);
}
//# sourceMappingURL=renderGrayscaleImage.js.map