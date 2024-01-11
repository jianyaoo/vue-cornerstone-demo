import { getRenderingEngine } from '@cornerstonejs/core';
export default function cameraSyncCallback(synchronizerInstance, sourceViewport, targetViewport, cameraModifiedEvent) {
    const { camera } = cameraModifiedEvent.detail;
    const renderingEngine = getRenderingEngine(targetViewport.renderingEngineId);
    if (!renderingEngine) {
        throw new Error(`No RenderingEngine for Id: ${targetViewport.renderingEngineId}`);
    }
    const tViewport = renderingEngine.getViewport(targetViewport.viewportId);
    tViewport.setCamera(camera);
    tViewport.render();
}
//# sourceMappingURL=cameraSyncCallback.js.map