import { state } from '../index';
function getSynchronizersForViewport(viewportId, renderingEngineId) {
    const synchronizersFilteredByIds = [];
    if (!renderingEngineId && !viewportId) {
        throw new Error('At least one of renderingEngineId or viewportId should be given');
    }
    for (let i = 0; i < state.synchronizers.length; i++) {
        const synchronizer = state.synchronizers[i];
        const notDisabled = !synchronizer.isDisabled();
        const hasSourceViewport = synchronizer.hasSourceViewport(renderingEngineId, viewportId);
        const hasTargetViewport = synchronizer.hasTargetViewport(renderingEngineId, viewportId);
        if (notDisabled && (hasSourceViewport || hasTargetViewport)) {
            synchronizersFilteredByIds.push(synchronizer);
        }
    }
    return synchronizersFilteredByIds;
}
export default getSynchronizersForViewport;
//# sourceMappingURL=getSynchronizersForViewport.js.map