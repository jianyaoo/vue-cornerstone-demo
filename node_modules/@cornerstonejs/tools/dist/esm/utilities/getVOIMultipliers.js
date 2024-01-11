import { utilities as csUtils } from '@cornerstonejs/core';
import { isViewportPreScaled } from './viewport';
const DEFAULT_MULTIPLIER = 4;
function getVOIMultipliers(viewport, volumeId, options) {
    const modality = csUtils.getViewportModality(viewport, volumeId);
    if (modality === 'PT') {
        const { clientWidth, clientHeight } = viewport.element;
        const ptMultiplier = 5 / Math.max(clientWidth, clientHeight);
        const isPreScaled = isViewportPreScaled(viewport, volumeId);
        const { fixedPTWindowWidth = true } = options ?? {};
        const xMultiplier = fixedPTWindowWidth ? 0 : ptMultiplier;
        return isPreScaled
            ? [xMultiplier, ptMultiplier]
            : [xMultiplier, DEFAULT_MULTIPLIER];
    }
    return [DEFAULT_MULTIPLIER, DEFAULT_MULTIPLIER];
}
export { getVOIMultipliers as default, getVOIMultipliers };
//# sourceMappingURL=getVOIMultipliers.js.map