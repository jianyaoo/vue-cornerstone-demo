"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getSliceRange_1 = __importDefault(require("./getSliceRange"));
const getTargetVolumeAndSpacingInNormalDir_1 = __importDefault(require("./getTargetVolumeAndSpacingInNormalDir"));
function getImageSliceDataForVolumeViewport(viewport) {
    const camera = viewport.getCamera();
    const { spacingInNormalDirection, imageVolume } = (0, getTargetVolumeAndSpacingInNormalDir_1.default)(viewport, camera);
    if (!imageVolume) {
        return;
    }
    const { viewPlaneNormal, focalPoint } = camera;
    const actorEntry = viewport
        .getActors()
        .find((a) => a.referenceId === imageVolume.volumeId || a.uid === imageVolume.volumeId);
    if (!actorEntry) {
        console.warn('No actor found for with actorUID of', imageVolume.volumeId);
    }
    const volumeActor = actorEntry.actor;
    const sliceRange = (0, getSliceRange_1.default)(volumeActor, viewPlaneNormal, focalPoint);
    const { min, max, current } = sliceRange;
    const numberOfSlices = Math.round((max - min) / spacingInNormalDirection) + 1;
    let imageIndex = ((current - min) / (max - min)) * numberOfSlices;
    imageIndex = Math.floor(imageIndex);
    if (imageIndex > numberOfSlices - 1) {
        imageIndex = numberOfSlices - 1;
    }
    else if (imageIndex < 0) {
        imageIndex = 0;
    }
    return {
        numberOfSlices,
        imageIndex,
    };
}
exports.default = getImageSliceDataForVolumeViewport;
//# sourceMappingURL=getImageSliceDataForVolumeViewport.js.map