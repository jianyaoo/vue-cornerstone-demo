import { getRenderingEngines, getRenderingEngine, } from '../RenderingEngine/getRenderingEngine';
function getViewportsWithVolumeId(volumeId, renderingEngineId) {
    let renderingEngines;
    if (renderingEngineId) {
        renderingEngines = [getRenderingEngine(renderingEngineId)];
    }
    else {
        renderingEngines = getRenderingEngines();
    }
    const targetViewports = [];
    renderingEngines.forEach((renderingEngine) => {
        const viewports = renderingEngine.getVolumeViewports();
        const filteredViewports = viewports.filter((vp) => vp.hasVolumeId(volumeId));
        targetViewports.push(...filteredViewports);
    });
    return targetViewports;
}
export default getViewportsWithVolumeId;
//# sourceMappingURL=getViewportsWithVolumeId.js.map