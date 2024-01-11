import { OrientationAxis } from '../enums';
import BaseVolumeViewport from './BaseVolumeViewport';
class VolumeViewport3D extends BaseVolumeViewport {
    constructor(props) {
        super(props);
        this.getRotation = () => 0;
        this.getCurrentImageIdIndex = () => {
            return undefined;
        };
        this.getCurrentImageId = () => {
            return null;
        };
        const { parallelProjection, orientation } = this.options;
        const activeCamera = this.getVtkActiveCamera();
        if (parallelProjection != null) {
            activeCamera.setParallelProjection(parallelProjection);
        }
        if (orientation && orientation !== OrientationAxis.ACQUISITION) {
            this.applyViewOrientation(orientation);
        }
    }
    resetCamera(resetPan = true, resetZoom = true, resetToCenter = true) {
        super.resetCamera(resetPan, resetZoom, resetToCenter);
        this.resetVolumeViewportClippingRange();
        return;
    }
    posProcessNewActors() {
        if (this.newActorAdded) {
            const renderer = this.getRenderer();
            renderer.resetCameraClippingRange();
        }
        super.posProcessNewActors();
    }
    setSlabThickness(slabThickness, filterActorUIDs) {
        return null;
    }
    setBlendMode(blendMode, filterActorUIDs, immediate) {
        return null;
    }
    resetProperties(volumeId) {
        return null;
    }
}
export default VolumeViewport3D;
//# sourceMappingURL=VolumeViewport3D.js.map