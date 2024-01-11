import getSliceRange from './getSliceRange';
import getTargetVolumeAndSpacingInNormalDir from './getTargetVolumeAndSpacingInNormalDir';
function getVolumeSliceRangeInfo(viewport, volumeId, useSlabThickness = false) {
    const camera = viewport.getCamera();
    const { focalPoint, viewPlaneNormal } = camera;
    const { spacingInNormalDirection, actorUID } = getTargetVolumeAndSpacingInNormalDir(viewport, camera, volumeId, useSlabThickness);
    if (!actorUID) {
        throw new Error(`Could not find image volume with id ${volumeId} in the viewport`);
    }
    const actorEntry = viewport.getActor(actorUID);
    if (!actorEntry) {
        console.warn('No actor found for with actorUID of', actorUID);
        return null;
    }
    const volumeActor = actorEntry.actor;
    const sliceRange = getSliceRange(volumeActor, viewPlaneNormal, focalPoint);
    return {
        sliceRange,
        spacingInNormalDirection,
        camera,
    };
}
export default getVolumeSliceRangeInfo;
//# sourceMappingURL=getVolumeSliceRangeInfo.js.map