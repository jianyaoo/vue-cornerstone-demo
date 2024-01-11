import * as colors from '../colors/index';
import now from './now';
function storedPixelDataToCanvasImageDataPseudocolorLUTPET(image, lutFunction, colorLUT, canvasImageDataData) {
    let start = now();
    const pixelData = image.getPixelData();
    image.stats.lastGetPixelDataTime = now() - start;
    const numPixels = pixelData.length;
    const minPixelValue = image.minPixelValue;
    let canvasImageDataIndex = 0;
    let storedPixelDataIndex = 0;
    let grayscale;
    let rgba;
    let clut;
    start = now();
    if (colorLUT instanceof colors.LookupTable) {
        clut = colorLUT.Table;
    }
    else {
        clut = colorLUT;
    }
    if (minPixelValue < 0) {
        while (storedPixelDataIndex < numPixels) {
            grayscale = lutFunction(pixelData[storedPixelDataIndex++] + -minPixelValue);
            rgba = clut[grayscale];
            canvasImageDataData[canvasImageDataIndex++] = rgba[0];
            canvasImageDataData[canvasImageDataIndex++] = rgba[1];
            canvasImageDataData[canvasImageDataIndex++] = rgba[2];
            canvasImageDataData[canvasImageDataIndex++] = rgba[3];
        }
    }
    else {
        while (storedPixelDataIndex < numPixels) {
            grayscale = lutFunction(pixelData[storedPixelDataIndex++]);
            rgba = clut[grayscale];
            canvasImageDataData[canvasImageDataIndex++] = rgba[0];
            canvasImageDataData[canvasImageDataIndex++] = rgba[1];
            canvasImageDataData[canvasImageDataIndex++] = rgba[2];
            canvasImageDataData[canvasImageDataIndex++] = rgba[3];
        }
    }
    image.stats.lastStoredPixelDataToCanvasImageDataTime = now() - start;
}
export default storedPixelDataToCanvasImageDataPseudocolorLUTPET;
//# sourceMappingURL=storedPixelDataToCanvasImageDataPseudocolorLUTPET.js.map