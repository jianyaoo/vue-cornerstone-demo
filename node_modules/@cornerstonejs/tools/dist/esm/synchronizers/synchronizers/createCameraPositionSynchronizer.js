import { createSynchronizer } from '../../store/SynchronizerManager';
import { Enums } from '@cornerstonejs/core';
import cameraSyncCallback from '../callbacks/cameraSyncCallback';
const { CAMERA_MODIFIED } = Enums.Events;
export default function createCameraPositionSynchronizer(synchronizerName) {
    const cameraPositionSynchronizer = createSynchronizer(synchronizerName, CAMERA_MODIFIED, cameraSyncCallback);
    return cameraPositionSynchronizer;
}
//# sourceMappingURL=createCameraPositionSynchronizer.js.map