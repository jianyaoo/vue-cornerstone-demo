"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const autoLoad = (volumeId) => {
    const renderingEngineAndViewportIds = getRenderingEngineAndViewportsContainingVolume(volumeId);
    if (!renderingEngineAndViewportIds || !renderingEngineAndViewportIds.length) {
        return;
    }
    renderingEngineAndViewportIds.forEach(({ renderingEngine, viewportIds }) => {
        if (!renderingEngine.hasBeenDestroyed) {
            renderingEngine.renderViewports(viewportIds);
        }
    });
};
function getRenderingEngineAndViewportsContainingVolume(volumeId) {
    const renderingEnginesArray = (0, core_1.getRenderingEngines)();
    const renderingEngineAndViewportIds = [];
    for (let i = 0; i < renderingEnginesArray.length; i++) {
        const renderingEngine = renderingEnginesArray[i];
        const viewports = core_1.utilities.getViewportsWithVolumeId(volumeId, renderingEngine.id);
        if (viewports.length) {
            renderingEngineAndViewportIds.push({
                renderingEngine,
                viewportIds: viewports.map((viewport) => viewport.id),
            });
        }
    }
    return renderingEngineAndViewportIds;
}
exports.default = autoLoad;
//# sourceMappingURL=autoLoad.js.map