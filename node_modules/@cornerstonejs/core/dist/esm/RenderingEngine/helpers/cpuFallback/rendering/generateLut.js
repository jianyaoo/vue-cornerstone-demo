import getModalityLut from './getModalityLut';
import getVOILUT from './getVOILut';
export default function (image, windowWidth, windowCenter, invert, modalityLUT, voiLUT) {
    const maxPixelValue = image.maxPixelValue;
    const minPixelValue = image.minPixelValue;
    const offset = Math.min(minPixelValue, 0);
    if (image.cachedLut === undefined) {
        const length = maxPixelValue - offset + 1;
        image.cachedLut = {};
        image.cachedLut.lutArray = new Uint8ClampedArray(length);
    }
    const lut = image.cachedLut.lutArray;
    const mlutfn = getModalityLut(image.slope, image.intercept, modalityLUT);
    const vlutfn = getVOILUT(windowWidth, windowCenter, voiLUT);
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
//# sourceMappingURL=generateLut.js.map