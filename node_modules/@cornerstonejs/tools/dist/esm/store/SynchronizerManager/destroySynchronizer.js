import { state } from '../index';
function destroySynchronizer(synchronizerId) {
    const synchronizerIndex = state.synchronizers.findIndex((sync) => sync.id === synchronizerId);
    if (synchronizerIndex > -1) {
        const synchronizer = state.synchronizers[synchronizerIndex];
        synchronizer.destroy();
        state.synchronizers.splice(synchronizerIndex, 1);
    }
}
export default destroySynchronizer;
//# sourceMappingURL=destroySynchronizer.js.map