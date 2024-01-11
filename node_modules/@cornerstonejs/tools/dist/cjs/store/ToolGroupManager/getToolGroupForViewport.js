"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function getToolGroupForViewport(viewportId, renderingEngineId) {
    const toolGroupFilteredByIds = index_1.state.toolGroups.filter((tg) => tg.viewportsInfo.some((vp) => vp.renderingEngineId === renderingEngineId &&
        (!vp.viewportId || vp.viewportId === viewportId)));
    if (!toolGroupFilteredByIds.length) {
        return;
    }
    if (toolGroupFilteredByIds.length > 1) {
        throw new Error(`Multiple tool groups found for renderingEngineId: ${renderingEngineId} and viewportId: ${viewportId}. You should only
      have one tool group per viewport in a renderingEngine.`);
    }
    return toolGroupFilteredByIds[0];
}
exports.default = getToolGroupForViewport;
//# sourceMappingURL=getToolGroupForViewport.js.map