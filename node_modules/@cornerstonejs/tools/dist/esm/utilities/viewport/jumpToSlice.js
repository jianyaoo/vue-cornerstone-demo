import { getEnabledElement, StackViewport, VolumeViewport, utilities as csUtils, } from '@cornerstonejs/core';
import clip from '../clip';
import scroll from '../scroll';
async function jumpToSlice(element, options = {}) {
    const { imageIndex, debounceLoading, volumeId } = options;
    const enabledElement = getEnabledElement(element);
    if (!enabledElement) {
        throw new Error('Element has been disabled');
    }
    const { viewport } = enabledElement;
    const { imageIndex: currentImageIndex, numberOfSlices } = _getImageSliceData(viewport, debounceLoading);
    const imageIndexToJump = _getImageIndexToJump(numberOfSlices, imageIndex);
    const delta = imageIndexToJump - currentImageIndex;
    scroll(viewport, { delta, debounceLoading, volumeId });
}
function _getImageSliceData(viewport, debounceLoading) {
    if (viewport instanceof StackViewport) {
        return {
            numberOfSlices: viewport.getImageIds().length,
            imageIndex: debounceLoading
                ? viewport.getTargetImageIdIndex()
                : viewport.getCurrentImageIdIndex(),
        };
    }
    else if (viewport instanceof VolumeViewport) {
        return csUtils.getImageSliceDataForVolumeViewport(viewport);
    }
    else {
        throw new Error('Unsupported viewport type');
    }
}
function _getImageIndexToJump(numberOfSlices, imageIndex) {
    const lastSliceIndex = numberOfSlices - 1;
    return clip(imageIndex, 0, lastSliceIndex);
}
export default jumpToSlice;
//# sourceMappingURL=jumpToSlice.js.map