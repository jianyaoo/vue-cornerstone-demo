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
    const minPixelValue = image.minPixelValue;
    let canvasImageDataIndex = 0;
    let storedPixelDataIndex = 0;
    const numPixels = pixelData.length;
    start = (0, now_1.default)();
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
    image.stats.lastStoredPixelDataToCanvasImageDataTime = (0, now_1.default)() - start;
}
exports.default = default_1;
//# sourceMappingURL=storedColorPixelDataToCanvasImageData.js.map