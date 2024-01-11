"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getVOILut_1 = __importDefault(require("./getVOILut"));
function generateColorLUT(image, windowWidth, windowCenter, invert, voiLUT) {
    const maxPixelValue = image.maxPixelValue;
    const minPixelValue = image.minPixelValue;
    const offset = Math.min(minPixelValue, 0);
    if (image.cachedLut === undefined) {
        const length = maxPixelValue - offset + 1;
        image.cachedLut = {};
        image.cachedLut.lutArray = new Uint8ClampedArray(length);
    }
    const lut = image.cachedLut.lutArray;
    const vlutfn = (0, getVOILut_1.default)(Array.isArray(windowWidth) ? windowWidth[0] : windowWidth, Array.isArray(windowCenter) ? windowCenter[0] : windowCenter, voiLUT);
    if (invert === true) {
        for (let storedValue = minPixelValue; storedValue <= maxPixelValue; storedValue++) {
            lut[storedValue + -offset] = 255 - vlutfn(storedValue);
        }
    }
    else {
        for (let storedValue = minPixelValue; storedValue <= maxPixelValue; storedValue++) {
            lut[storedValue + -offset] = vlutfn(storedValue);
        }
    }
    return lut;
}
exports.default = generateColorLUT;
//# sourceMappingURL=generateColorLUT.js.map