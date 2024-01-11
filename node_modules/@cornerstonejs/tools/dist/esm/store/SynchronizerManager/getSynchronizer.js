import { state } from '../index';
function getSynchronizer(synchronizerId) {
    return state.synchronizers.find((s) => s.id === synchronizerId);
}
export default getSynchronizer;
//# sourceMappingURL=getSynchronizer.js.map