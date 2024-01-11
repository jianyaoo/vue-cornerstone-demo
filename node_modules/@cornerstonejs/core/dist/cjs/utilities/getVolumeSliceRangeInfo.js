"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getSliceRange_1 = __importDefault(require("./getSliceRange"));
const getTargetVolumeAndSpacingInNormalDir_1 = __importDefault(require("./getTargetVolumeAndSpacingInNormalDir"));
function getVolumeSliceRangeInfo(viewport, volumeId, useSlabThickness = false) {
    const camera = viewport.getCamera();
    const { focalPoint, viewPlaneNormal } = camera;
    const { spacingInNormalDirection, actorUID } = (0, getTargetVolumeAndSpacingInNormalDir_1.default)(viewport, camera, volumeId, useSlabThickness);
    if (!actorUID) {
        throw new Error(`Could not find image volume with id ${volumeId} in the viewport`);
    }
    const actorEntry = viewport.getActor(actorUID);
    if (!actorEntry) {
        console.warn('No actor found for with actorUID of', actorUID);
        return null;
    }
    const volumeActor = actorEntry.actor;
    const sliceRange = (0, getSliceRange_1.default)(volumeActor, viewPlaneNormal, focalPoint);
    return {
        sliceRange,
        spacingInNormalDirection,
        camera,
    };
}
exports.default = getVolumeSliceRangeInfo;
//# sourceMappingURL=getVolumeSliceRangeInfo.js.map