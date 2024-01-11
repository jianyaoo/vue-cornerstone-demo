import { getEnabledElement } from '@cornerstonejs/core';
function removeContourFromElement(element, segmentationRepresentationUID, removeFromCache = false) {
    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;
    const actorEntries = viewport.getActors();
    const actorUIDsToRemove = actorEntries
        .map(({ uid }) => uid.startsWith(segmentationRepresentationUID) ? uid : undefined)
        .filter(Boolean);
    viewport.removeActors(actorUIDsToRemove);
}
export default removeContourFromElement;
//# sourceMappingURL=removeSurfaceFromElement.js.map