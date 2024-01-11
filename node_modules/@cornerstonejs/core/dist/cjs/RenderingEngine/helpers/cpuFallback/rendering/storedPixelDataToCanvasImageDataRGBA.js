"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const now_1 = __importDefault(require("./now"));
function default_1(image, lut, canvasImageDataData) {
    let start = (0, now_1.default)();
    const pixelData = image.getPixelData();
    image.stats.lastGetPixelDataTime = (0, now_1.default)() - start;
    const numPixels = pixelData.length;
    const minPixelValue = image.minPixelValue;
    let canvasImageDataIndex = 0;
    let storedPixelDataIndex = 0;
    let pixelValue;
    start = (0, now_1.default)();
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
    image.stats.lastStoredPixelDataToCanvasImageDataTime = (0, now_1.default)() - start;
}
exports.default = default_1;
//# sourceMappingURL=storedPixelDataToCanvasImageDataRGBA.js.map