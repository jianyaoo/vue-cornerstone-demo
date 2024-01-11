"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRenderingEngine_1 = require("../RenderingEngine/getRenderingEngine");
function getViewportsWithVolumeId(volumeId, renderingEngineId) {
    let renderingEngines;
    if (renderingEngineId) {
        renderingEngines = [(0, getRenderingEngine_1.getRenderingEngine)(renderingEngineId)];
    }
    else {
        renderingEngines = (0, getRenderingEngine_1.getRenderingEngines)();
    }
    const targetViewports = [];
    renderingEngines.forEach((renderingEngine) => {
        const viewports = renderingEngine.getVolumeViewports();
        const filteredViewports = viewports.filter((vp) => vp.hasVolumeId(volumeId));
        targetViewports.push(...filteredViewports);
    });
    return targetViewports;
}
exports.default = getViewportsWithVolumeId;
//# sourceMappingURL=getViewportsWithVolumeId.js.map