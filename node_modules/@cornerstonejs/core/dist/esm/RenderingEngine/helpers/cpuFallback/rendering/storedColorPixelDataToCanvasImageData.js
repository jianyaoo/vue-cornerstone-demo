import now from './now';
export default function (image, lut, canvasImageDataData) {
    let start = now();
    const pixelData = image.getPixelData();
    image.stats.lastGetPixelDataTime = now() - start;
    const minPixelValue = image.minPixelValue;
    let canvasImageDataIndex = 0;
    let storedPixelDataIndex = 0;
    const numPixels = pixelData.length;
    start = now();
    if (minPixelValue < 0) {
        while (storedPixelDataIndex < numPixels) {
            canvasImageDataData[canvasImageDataIndex++] =
                lut[pixelData[storedPixelDataIndex++] + -minPixelValue];
            canvasImageDataData[canvasImageDataIndex++] =
                lut[pixelData[storedPixelDataIndex++] + -minPixelValue];
            canvasImageDataData[canvasImageDataIndex] =
                lut[pixelData[storedPixelDataIndex] + -minPixelValue];
            storedPixelDataIndex += 2;
            canvasImageDataIndex += 2;
        }
    }
    else {
        while (storedPixelDataIndex < numPixels) {
            canvasImageDataData[canvasImageDataIndex++] =
                lut[pixelData[storedPixelDataIndex++]];
            canvasImageDataData[canvasImageDataIndex++] =
                lut[pixelData[storedPixelDataIndex++]];
            canvasImageDataData[canvasImageDataIndex] =
                lut[pixelData[storedPixelDataIndex]];
            storedPixelDataIndex += 2;
            canvasImageDataIndex += 2;
        }
    }
    image.stats.lastStoredPixelDataToCanvasImageDataTime = now() - start;
}
//# sourceMappingURL=storedColorPixelDataToCanvasImageData.js.map