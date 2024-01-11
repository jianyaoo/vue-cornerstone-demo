import { getRenderingEngine } from '@cornerstonejs/core';
export default function zoomPanSyncCallback(synchronizerInstance, sourceViewport, targetViewport) {
    const renderingEngine = getRenderingEngine(targetViewport.renderingEngineId);
    if (!renderingEngine) {
        throw new Error(`No RenderingEngine for Id: ${targetViewport.renderingEngineId}`);
    }
    const options = synchronizerInstance.getOptions(targetViewport.viewportId);
    const tViewport = renderingEngine.getViewport(targetViewport.viewportId);
    const sViewport = renderingEngine.getViewport(sourceViewport.viewportId);
    if (options?.syncZoom !== false) {
        const srcZoom = sViewport.getZoom();
        tViewport.setZoom(srcZoom);
    }
    if (options?.syncPan !== false) {
        const srcPan = sViewport.getPan();
        tViewport.setPan(srcPan);
    }
    tViewport.render();
}
//# sourceMappingURL=zoomPanSyncCallback.js.map