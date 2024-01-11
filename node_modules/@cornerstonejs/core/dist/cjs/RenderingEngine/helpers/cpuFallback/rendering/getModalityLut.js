"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateLinearModalityLUT(slope, intercept) {
    return (storedPixelValue) => storedPixelValue * slope + intercept;
}
function generateNonLinearModalityLUT(modalityLUT) {
    const minValue = modalityLUT.lut[0];
    const maxValue = modalityLUT.lut[modalityLUT.lut.length - 1];
    const maxValueMapped = modalityLUT.firstValueMapped + modalityLUT.lut.length;
    return (storedPixelValue) => {
        if (storedPixelValue < modalityLUT.firstValueMapped) {
            return minValue;
        }
        else if (storedPixelValue >= maxValueMapped) {
            return maxValue;
        }
        return modalityLUT.lut[storedPixelValue];
    };
}
function default_1(slope, intercept, modalityLUT) {
    if (modalityLUT) {
        return generateNonLinearModalityLUT(modalityLUT);
    }
    return generateLinearModalityLUT(slope, intercept);
}
exports.default = default_1;
//# sourceMappingURL=getModalityLut.js.map