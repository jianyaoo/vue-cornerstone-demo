"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVOIMultipliers = exports.default = void 0;
const core_1 = require("@cornerstonejs/core");
const viewport_1 = require("./viewport");
const DEFAULT_MULTIPLIER = 4;
function getVOIMultipliers(viewport, volumeId, options) {
    const modality = core_1.utilities.getViewportModality(viewport, volumeId);
    if (modality === 'PT') {
        const { clientWidth, clientHeight } = viewport.element;
        const ptMultiplier = 5 / Math.max(clientWidth, clientHeight);
        const isPreScaled = (0, viewport_1.isViewportPreScaled)(viewport, volumeId);
        const { fixedPTWindowWidth = true } = options !== null && options !== void 0 ? options : {};
        const xMultiplier = fixedPTWindowWidth ? 0 : ptMultiplier;
        return isPreScaled
            ? [xMultiplier, ptMultiplier]
            : [xMultiplier, DEFAULT_MULTIPLIER];
    }
    return [DEFAULT_MULTIPLIER, DEFAULT_MULTIPLIER];
}
exports.default = getVOIMultipliers;
exports.getVOIMultipliers = getVOIMultipliers;
//# sourceMappingURL=getVOIMultipliers.js.map