import { createSynchronizer } from '../../store/SynchronizerManager';
import { Enums } from '@cornerstonejs/core';
import zoomPanSyncCallback from '../callbacks/zoomPanSyncCallback';
const { CAMERA_MODIFIED } = Enums.Events;
export default function createZoomPanSynchronizer(synchronizerName) {
    const zoomPanSynchronizer = createSynchronizer(synchronizerName, CAMERA_MODIFIED, zoomPanSyncCallback);
    return zoomPanSynchronizer;
}
//# sourceMappingURL=createZoomPanSynchronizer.js.map