"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getVolumeSliceRangeInfo_1 = __importDefault(require("./getVolumeSliceRangeInfo"));
function getVolumeViewportScrollInfo(viewport, volumeId, useSlabThickness = false) {
    const { sliceRange, spacingInNormalDirection, camera } = (0, getVolumeSliceRangeInfo_1.default)(viewport, volumeId, useSlabThickness);
    const { min, max, current } = sliceRange;
    const numScrollSteps = Math.round((max - min) / spacingInNormalDirection);
    const fraction = (current - min) / (max - min);
    const floatingStepNumber = fraction * numScrollSteps;
    const currentStepIndex = Math.round(floatingStepNumber);
    return {
        numScrollSteps,
        currentStepIndex,
        sliceRangeInfo: {
            sliceRange,
            spacingInNormalDirection,
            camera,
        },
    };
}
exports.default = getVolumeViewportScrollInfo;
//# sourceMappingURL=getVolumeViewportScrollInfo.js.map