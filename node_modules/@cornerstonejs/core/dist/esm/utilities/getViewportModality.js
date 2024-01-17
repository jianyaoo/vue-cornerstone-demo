import cache from '../cache';
function getViewportModality(viewport, volumeId) {
    if (viewport.modality) {
        return viewport.modality;
    }
    if (viewport.setVolumes) {
        volumeId = volumeId ?? viewport.getDefaultActor()?.uid;
        if (!volumeId) {
            return;
        }
        return cache.getVolume(volumeId)?.metadata.Modality;
    }
    throw new Error('Invalid viewport type');
}
export { getViewportModality as default, getViewportModality };
//# sourceMappingURL=getViewportModality.js.map