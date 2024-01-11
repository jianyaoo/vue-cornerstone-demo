"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
function removeContourFromElement(element, segmentationRepresentationUID, removeFromCache = false) {
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const actorEntries = viewport.getActors();
    const actorUIDsToRemove = actorEntries
        .map(({ uid }) => uid.startsWith(segmentationRepresentationUID) ? uid : undefined)
        .filter(Boolean);
    viewport.removeActors(actorUIDsToRemove);
}
exports.default = removeContourFromElement;
//# sourceMappingURL=removeSurfaceFromElement.js.map