"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
function voiSyncCallback(synchronizerInstance, sourceViewport, targetViewport, voiModifiedEvent, options) {
    const eventDetail = voiModifiedEvent.detail;
    const { volumeId, range, invertStateChanged, invert } = eventDetail;
    const renderingEngine = (0, core_1.getRenderingEngine)(targetViewport.renderingEngineId);
    if (!renderingEngine) {
        throw new Error(`Rendering Engine does not exist: ${targetViewport.renderingEngineId}`);
    }
    const tViewport = renderingEngine.getViewport(targetViewport.viewportId);
    const tProperties = {
        voiRange: range,
    };
    if ((options === null || options === void 0 ? void 0 : options.syncInvertState) && invertStateChanged) {
        tProperties.invert = invert;
    }
    if (tViewport instanceof core_1.BaseVolumeViewport) {
        tViewport.setProperties(tProperties, volumeId);
    }
    else if (tViewport instanceof core_1.StackViewport) {
        tViewport.setProperties(tProperties);
    }
    else {
        throw new Error('Viewport type not supported.');
    }
    tViewport.render();
}
exports.default = voiSyncCallback;
//# sourceMappingURL=voiSyncCallback.js.map