"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getModalityLut_1 = __importDefault(require("./getModalityLut"));
const getVOILut_1 = __importDefault(require("./getVOILut"));
function default_1(image, windowWidth, windowCenter, invert, modalityLUT, voiLUT) {
    const maxPixelValue = image.maxPixelValue;
    const minPixelValue = image.minPixelValue;
    const offset = Math.min(minPixelValue, 0);
    if (image.cachedLut === undefined) {
        const length = maxPixelValue - offset + 1;
        image.cachedLut = {};
        image.cachedLut.lutArray = new Uint8ClampedArray(length);
    }
    const lut = image.cachedLut.lutArray;
    const mlutfn = (0, getModalityLut_1.default)(image.slope, image.intercept, modalityLUT);
    const vlutfn = (0, getVOILut_1.default)(windowWidth, windowCenter, voiLUT);
    if (image.isPreScaled) {
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
    }
    else {
        if (invert === true) {
            for (let storedValue = minPixelValue; storedValue <= maxPixelValue; storedValue++) {
                lut[storedValue + -offset] = 255 - vlutfn(mlutfn(storedValue));
            }
        }
        else {
            for (let storedValue = minPixelValue; storedValue <= maxPixelValue; storedValue++) {
                lut[storedValue + -offset] = vlutfn(mlutfn(storedValue));
            }
        }
    }
    return lut;
}
exports.default = default_1;
//# sourceMappingURL=generateLut.js.map