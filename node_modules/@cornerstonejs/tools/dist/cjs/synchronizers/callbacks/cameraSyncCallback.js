"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
function cameraSyncCallback(synchronizerInstance, sourceViewport, targetViewport, cameraModifiedEvent) {
    const { camera } = cameraModifiedEvent.detail;
    const renderingEngine = (0, core_1.getRenderingEngine)(targetViewport.renderingEngineId);
    if (!renderingEngine) {
        throw new Error(`No RenderingEngine for Id: ${targetViewport.renderingEngineId}`);
    }
    const tViewport = renderingEngine.getViewport(targetViewport.viewportId);
    tViewport.setCamera(camera);
    tViewport.render();
}
exports.default = cameraSyncCallback;
//# sourceMappingURL=cameraSyncCallback.js.map