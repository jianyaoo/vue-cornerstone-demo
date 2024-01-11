import getVOILUT from './getVOILut';
export default function generateColorLUT(image, windowWidth, windowCenter, invert, voiLUT) {
    const maxPixelValue = image.maxPixelValue;
    const minPixelValue = image.minPixelValue;
    const offset = Math.min(minPixelValue, 0);
    if (image.cachedLut === undefined) {
        const length = maxPixelValue - offset + 1;
        image.cachedLut = {};
        image.cachedLut.lutArray = new Uint8ClampedArray(length);
    }
    const lut = image.cachedLut.lutArray;
    const vlutfn = getVOILUT(Array.isArray(windowWidth) ? windowWidth[0] : windowWidth, Array.isArray(windowCenter) ? windowCenter[0] : windowCenter, voiLUT);
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
//# sourceMappingURL=generateColorLUT.js.map