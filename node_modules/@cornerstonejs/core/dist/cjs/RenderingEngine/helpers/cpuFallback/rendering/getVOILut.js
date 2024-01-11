"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateLinearVOILUT(windowWidth, windowCenter) {
    return function (modalityLutValue) {
        const value = ((modalityLutValue - (windowCenter - 0.5)) / (windowWidth - 1) + 0.5) *
            255.0;
        return Math.min(Math.max(value, 0), 255);
    };
}
function generateNonLinearVOILUT(voiLUT) {
    const bitsPerEntry = Math.max(...voiLUT.lut).toString(2).length;
    const shift = bitsPerEntry - 8;
    const minValue = voiLUT.lut[0] >> shift;
    const maxValue = voiLUT.lut[voiLUT.lut.length - 1] >> shift;
    const maxValueMapped = voiLUT.firstValueMapped + voiLUT.lut.length - 1;
    return function (modalityLutValue) {
        if (modalityLutValue < voiLUT.firstValueMapped) {
            return minValue;
        }
        else if (modalityLutValue >= maxValueMapped) {
            return maxValue;
        }
        return voiLUT.lut[modalityLutValue - voiLUT.firstValueMapped] >> shift;
    };
}
function default_1(windowWidth, windowCenter, voiLUT) {
    if (voiLUT) {
        return generateNonLinearVOILUT(voiLUT);
    }
    return generateLinearVOILUT(windowWidth, windowCenter);
}
exports.default = default_1;
//# sourceMappingURL=getVOILut.js.map