"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRenderingEngine_1 = require("../RenderingEngine/getRenderingEngine");
function getVolumeViewportsContainingSameVolumes(targetViewport, renderingEngineId) {
    let renderingEngines;
    if (renderingEngineId) {
        renderingEngines = [(0, getRenderingEngine_1.getRenderingEngine)(renderingEngineId)];
    }
    else {
        renderingEngines = (0, getRenderingEngine_1.getRenderingEngines)();
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
exports.default = getVolumeViewportsContainingSameVolumes;
//# sourceMappingURL=getVolumeViewportsContainingSameVolumes.js.map