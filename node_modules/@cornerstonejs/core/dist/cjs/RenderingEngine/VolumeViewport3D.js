"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const BaseVolumeViewport_1 = __importDefault(require("./BaseVolumeViewport"));
class VolumeViewport3D extends BaseVolumeViewport_1.default {
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
        if (orientation && orientation !== enums_1.OrientationAxis.ACQUISITION) {
            this.applyViewOrientation(orientation);
        }
    }
    resetCamera(resetPan = true, resetZoom = true, resetToCenter = true) {
        super.resetCamera(resetPan, resetZoom, resetToCenter);
        this.resetVolumeViewportClippingRange();
        return;
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
    resetSlabThickness() {
        return null;
    }
}
exports.default = VolumeViewport3D;
//# sourceMappingURL=VolumeViewport3D.js.map