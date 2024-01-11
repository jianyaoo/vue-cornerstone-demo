"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
function zoomPanSyncCallback(synchronizerInstance, sourceViewport, targetViewport) {
    const renderingEngine = (0, core_1.getRenderingEngine)(targetViewport.renderingEngineId);
    if (!renderingEngine) {
        throw new Error(`No RenderingEngine for Id: ${targetViewport.renderingEngineId}`);
    }
    const options = synchronizerInstance.getOptions(targetViewport.viewportId);
    const tViewport = renderingEngine.getViewport(targetViewport.viewportId);
    const sViewport = renderingEngine.getViewport(sourceViewport.viewportId);
    if ((options === null || options === void 0 ? void 0 : options.syncZoom) !== false) {
        const srcZoom = sViewport.getZoom();
        tViewport.setZoom(srcZoom);
    }
    if ((options === null || options === void 0 ? void 0 : options.syncPan) !== false) {
        const srcPan = sViewport.getPan();
        tViewport.setPan(srcPan);
    }
    tViewport.render();
}
exports.default = zoomPanSyncCallback;
//# sourceMappingURL=zoomPanSyncCallback.js.map