"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function getSynchronizersForViewport(viewportId, renderingEngineId) {
    const synchronizersFilteredByIds = [];
    if (!renderingEngineId && !viewportId) {
        throw new Error('At least one of renderingEngineId or viewportId should be given');
    }
    for (let i = 0; i < index_1.state.synchronizers.length; i++) {
        const synchronizer = index_1.state.synchronizers[i];
        const notDisabled = !synchronizer.isDisabled();
        const hasSourceViewport = synchronizer.hasSourceViewport(renderingEngineId, viewportId);
        const hasTargetViewport = synchronizer.hasTargetViewport(renderingEngineId, viewportId);
        if (notDisabled && (hasSourceViewport || hasTargetViewport)) {
            synchronizersFilteredByIds.push(synchronizer);
        }
    }
    return synchronizersFilteredByIds;
}
exports.default = getSynchronizersForViewport;
//# sourceMappingURL=getSynchronizersForViewport.js.map