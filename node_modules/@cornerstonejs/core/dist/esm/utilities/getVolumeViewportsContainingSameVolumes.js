import { getRenderingEngines, getRenderingEngine, } from '../RenderingEngine/getRenderingEngine';
function getVolumeViewportsContainingSameVolumes(targetViewport, renderingEngineId) {
    let renderingEngines;
    if (renderingEngineId) {
        renderingEngines = [getRenderingEngine(renderingEngineId)];
    }
    else {
        renderingEngines = getRenderingEngines();
    }
    const sameVolumesViewports = [];
    renderingEngines.forEach((renderingEngine) => {
        const targetActors = targetViewport.getActors();
        const viewports = renderingEngine.getVolumeViewports();
        for (const vp of viewports) {
            const vpActors = vp.getActors();
            if (vpActors.length !== targetActors.length) {
                continue;
            }
            const sameVolumes = targetActors.every(({ uid }) => vpActors.find((vpActor) => uid === vpActor.uid));
            if (sameVolumes) {
                sameVolumesViewports.push(vp);
            }
        }
    });
    return sameVolumesViewports;
}
export default getVolumeViewportsContainingSameVolumes;
//# sourceMappingURL=getVolumeViewportsContainingSameVolumes.js.map