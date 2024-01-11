import { StackViewport, getEnabledElement } from '@cornerstonejs/core';
function removeLabelmapFromElement(element, segmentationRepresentationUID, removeFromCache = false) {
    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;
    if (viewport instanceof StackViewport) {
        return;
    }
    viewport.removeVolumeActors([
        segmentationRepresentationUID,
    ]);
}
export default removeLabelmapFromElement;
//# sourceMappingURL=removeLabelmapFromElement.js.map