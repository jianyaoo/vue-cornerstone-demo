import setToPixelCoordinateSystem from './setToPixelCoordinateSystem';
import now from './now';
import initializeRenderCanvas from './initializeRenderCanvas';
import getLut from './getLut';
import saveLastRendered from './saveLastRendered';
import doesImageNeedToBeRendered from './doesImageNeedToBeRendered';
import storedPixelDataToCanvasImageDataPseudocolorLUT from './storedPixelDataToCanvasImageDataPseudocolorLUT';
import storedPixelDataToCanvasImageDataPseudocolorLUTPET from './storedPixelDataToCanvasImageDataPseudocolorLUTPET';
import * as colors from '../colors/index';
import { clamp } from '../../../../utilities';
function getRenderCanvas(enabledElement, image, invalidated) {
    if (!enabledElement.renderingTools.renderCanvas) {
        enabledElement.renderingTools.renderCanvas =
            document.createElement('canvas');
    }
    const renderCanvas = enabledElement.renderingTools.renderCanvas;
    let colormap = enabledElement.viewport.colormap || enabledElement.options.colormap;
    if (enabledElement.options && enabledElement.options.colormap) {
        console.warn('enabledElement.options.colormap is deprecated. Use enabledElement.viewport.colormap instead');
    }
    if (colormap && typeof colormap === 'string') {
        colormap = colors.getColormap(colormap);
    }
    if (!colormap) {
        throw new Error('renderPseudoColorImage: colormap not found.');
    }
    const colormapId = colormap.getId();
    if (doesImageNeedToBeRendered(enabledElement, image) === false &&
        invalidated !== true &&
        enabledElement.renderingTools.colormapId === colormapId) {
        return renderCanvas;
    }
    if (renderCanvas.width !== image.width ||
        renderCanvas.height !== image.height) {
        initializeRenderCanvas(enabledElement, image);
    }
    let start = now();
    if (!enabledElement.renderingTools.colorLUT ||
        invalidated ||
        enabledElement.renderingTools.colormapId !== colormapId) {
        colormap.setNumberOfColors(256);
        enabledElement.renderingTools.colorLUT = colormap.createLookupTable();
        enabledElement.renderingTools.colormapId = colormapId;
    }
    const renderCanvasData = enabledElement.renderingTools.renderCanvasData;
    const renderCanvasContext = enabledElement.renderingTools.renderCanvasContext;
    const { viewport } = enabledElement;
    const colorLUT = enabledElement.renderingTools.colorLUT;
    if (viewport.modality === 'PT') {
        const { windowWidth, windowCenter } = viewport.voi;
        const minimum = windowCenter - windowWidth / 2;
        const maximum = windowCenter + windowWidth / 2;
        const range = maximum - minimum;
        const collectedMultiplierTerms = 255.0 / range;
        let petVOILutFunction;
        if (viewport.invert) {
            petVOILutFunction = (value) => {
                return clamp(Math.floor(255 - (value - minimum) * collectedMultiplierTerms), 0, 255);
            };
        }
        else {
            petVOILutFunction = (value) => {
                return clamp(Math.floor((value - minimum) * collectedMultiplierTerms), 0, 255);
            };
        }
        storedPixelDataToCanvasImageDataPseudocolorLUTPET(image, petVOILutFunction, colorLUT, renderCanvasData.data);
    }
    else {
        const lut = getLut(image, enabledElement.viewport, invalidated);
        image.stats = image.stats || {};
        image.stats.lastLutGenerateTime = now() - start;
        storedPixelDataToCanvasImageDataPseudocolorLUT(image, lut, colorLUT, renderCanvasData.data);
    }
    start = now();
    renderCanvasContext.putImageData(renderCanvasData, 0, 0);
    image.stats.lastPutImageDataTime = now() - start;
    return renderCanvas;
}
export function renderPseudoColorImage(enabledElement, invalidated) {
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
//# sourceMappingURL=renderPseudoColorImage.js.map