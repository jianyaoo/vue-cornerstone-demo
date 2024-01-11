"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors = __importStar(require("../colors/index"));
const now_1 = __importDefault(require("./now"));
function storedPixelDataToCanvasImageDataPseudocolorLUTPET(image, lutFunction, colorLUT, canvasImageDataData) {
    let start = (0, now_1.default)();
    const pixelData = image.getPixelData();
    image.stats.lastGetPixelDataTime = (0, now_1.default)() - start;
    const numPixels = pixelData.length;
    const minPixelValue = image.minPixelValue;
    let canvasImageDataIndex = 0;
    let storedPixelDataIndex = 0;
    let grayscale;
    let rgba;
    let clut;
    start = (0, now_1.default)();
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
    image.stats.lastStoredPixelDataToCanvasImageDataTime = (0, now_1.default)() - start;
}
exports.default = storedPixelDataToCanvasImageDataPseudocolorLUTPET;
//# sourceMappingURL=storedPixelDataToCanvasImageDataPseudocolorLUTPET.js.map