import { createSynchronizer } from '../../store/SynchronizerManager';
import { Enums } from '@cornerstonejs/core';
import voiSyncCallback from '../callbacks/voiSyncCallback';
export default function createVOISynchronizer(synchronizerName, options = { syncInvertState: true }) {
    const VOISynchronizer = createSynchronizer(synchronizerName, Enums.Events.VOI_MODIFIED, voiSyncCallback, options);
    return VOISynchronizer;
}
//# sourceMappingURL=createVOISynchronizer.js.map