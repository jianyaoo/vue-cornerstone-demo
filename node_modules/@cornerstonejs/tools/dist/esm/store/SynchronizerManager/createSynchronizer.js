import { state } from '../index';
import Synchronizer from './Synchronizer';
function createSynchronizer(synchronizerId, eventName, eventHandler, options) {
    const synchronizerWithSameIdExists = state.synchronizers.some((sync) => sync.id === synchronizerId);
    if (synchronizerWithSameIdExists) {
        throw new Error(`Synchronizer with id '${synchronizerId}' already exists.`);
    }
    const synchronizer = new Synchronizer(synchronizerId, eventName, eventHandler, options);
    state.synchronizers.push(synchronizer);
    return synchronizer;
}
export default createSynchronizer;
//# sourceMappingURL=createSynchronizer.js.map