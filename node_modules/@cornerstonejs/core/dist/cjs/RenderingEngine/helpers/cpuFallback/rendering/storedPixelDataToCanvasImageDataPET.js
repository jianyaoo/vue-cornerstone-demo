"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const now_1 = __importDefault(require("./now"));
function default_1(image, lutFunction, canvasImageDataData) {
    let start = (0, now_1.default)();
    const pixelData = image.getPixelData();
    image.stats.lastGetPixelDataTime = (0, now_1.default)() - start;
    const numPixels = pixelData.length;
    let canvasImageDataIndex = 3;
    let storedPixelDataIndex = 0;
    start = (0, now_1.default)();
    while (storedPixelDataIndex < numPixels) {
        canvasImageDataData[canvasImageDataIndex] = lutFunction(pixelData[storedPixelDataIndex++]);
        canvasImageDataIndex += 4;
    }
    image.stats.lastStoredPixelDataToCanvasImageDataTime = (0, now_1.default)() - start;
}
exports.default = default_1;
//# sourceMappingURL=storedPixelDataToCanvasImageDataPET.js.map