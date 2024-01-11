import now from './now';
export default function (image, lut, canvasImageDataData) {
    let start = now();
    const pixelData = image.getPixelData();
    image.stats.lastGetPixelDataTime = now() - start;
    const numPixels = pixelData.length;
    const minPixelValue = image.minPixelValue;
    let canvasImageDataIndex = 0;
    let storedPixelDataIndex = 0;
    let pixelValue;
    start = now();
    if (pixelData instanceof Int16Array) {
        if (minPixelValue < 0) {
            while (storedPixelDataIndex < numPixels) {
                pixelValue = lut[pixelData[storedPixelDataIndex++] + -minPixelValue];
                canvasImageDataData[canvasImageDataIndex++] = pixelValue;
                canvasImageDataData[canvasImageDataIndex++] = pixelValue;
                canvasImageDataData[canvasImageDataIndex++] = pixelValue;
                canvasImageDataData[canvasImageDataIndex++] = 255;
            }
        }
        else {
            while (storedPixelDataIndex < numPixels) {
                pixelValue = lut[pixelData[storedPixelDataIndex++]];
                canvasImageDataData[canvasImageDataIndex++] = pixelValue;
                canvasImageDataData[canvasImageDataIndex++] = pixelValue;
                canvasImageDataData[canvasImageDataIndex++] = pixelValue;
                canvasImageDataData[canvasImageDataIndex++] = 255;
            }
        }
    }
    else if (pixelData instanceof Uint16Array) {
        while (storedPixelDataIndex < numPixels) {
            pixelValue = lut[pixelData[storedPixelDataIndex++]];
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = 255;
        }
    }
    else if (minPixelValue < 0) {
        while (storedPixelDataIndex < numPixels) {
            pixelValue = lut[pixelData[storedPixelDataIndex++] + -minPixelValue];
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = 255;
        }
    }
    else {
        while (storedPixelDataIndex < numPixels) {
            pixelValue = lut[pixelData[storedPixelDataIndex++]];
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = pixelValue;
            canvasImageDataData[canvasImageDataIndex++] = 255;
        }
    }
    image.stats.lastStoredPixelDataToCanvasImageDataTime = now() - start;
}
//# sourceMappingURL=storedPixelDataToCanvasImageDataRGBA.js.map