import getSliceRange from './getSliceRange';
import getTargetVolumeAndSpacingInNormalDir from './getTargetVolumeAndSpacingInNormalDir';
function getImageSliceDataForVolumeViewport(viewport) {
    const camera = viewport.getCamera();
    const { spacingInNormalDirection, imageVolume } = getTargetVolumeAndSpacingInNormalDir(viewport, camera);
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
    const sliceRange = getSliceRange(volumeActor, viewPlaneNormal, focalPoint);
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
export default getImageSliceDataForVolumeViewport;
//# sourceMappingURL=getImageSliceDataForVolumeViewport.js.map