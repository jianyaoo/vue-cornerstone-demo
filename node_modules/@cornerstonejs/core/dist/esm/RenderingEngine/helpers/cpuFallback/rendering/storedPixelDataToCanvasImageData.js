import now from './now';
export default function (image, lut, canvasImageDataData) {
    let start = now();
    const pixelData = image.getPixelData();
    image.stats.lastGetPixelDataTime = now() - start;
    const numPixels = pixelData.length;
    const minPixelValue = image.minPixelValue;
    let canvasImageDataIndex = 3;
    let storedPixelDataIndex = 0;
    start = now();
    if (pixelData instanceof Int16Array) {
        if (minPixelValue < 0) {
            while (storedPixelDataIndex < numPixels) {
                canvasImageDataData[canvasImageDataIndex] =
                    lut[pixelData[storedPixelDataIndex++] + -minPixelValue];
                canvasImageDataIndex += 4;
            }
        }
        else {
            while (storedPixelDataIndex < numPixels) {
                canvasImageDataData[canvasImageDataIndex] =
                    lut[pixelData[storedPixelDataIndex++]];
                canvasImageDataIndex += 4;
            }
        }
    }
    else if (pixelData instanceof Uint16Array) {
        while (storedPixelDataIndex < numPixels) {
            canvasImageDataData[canvasImageDataIndex] =
                lut[pixelData[storedPixelDataIndex++]];
            canvasImageDataIndex += 4;
        }
    }
    else if (minPixelValue < 0) {
        while (storedPixelDataIndex < numPixels) {
            canvasImageDataData[canvasImageDataIndex] =
                lut[pixelData[storedPixelDataIndex++] + -minPixelValue];
            canvasImageDataIndex += 4;
        }
    }
    else {
        while (storedPixelDataIndex < numPixels) {
            canvasImageDataData[canvasImageDataIndex] =
                lut[pixelData[storedPixelDataIndex++]];
            canvasImageDataIndex += 4;
        }
    }
    image.stats.lastStoredPixelDataToCanvasImageDataTime = now() - start;
}
//# sourceMappingURL=storedPixelDataToCanvasImageData.js.map