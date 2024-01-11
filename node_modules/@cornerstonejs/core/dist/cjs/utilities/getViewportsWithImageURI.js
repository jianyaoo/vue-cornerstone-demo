"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RenderingEngine_1 = require("../RenderingEngine");
const getRenderingEngine_1 = require("../RenderingEngine/getRenderingEngine");
function getViewportsWithImageURI(imageURI, renderingEngineId) {
    let renderingEngines;
    if (renderingEngineId) {
        renderingEngines = [(0, RenderingEngine_1.getRenderingEngine)(renderingEngineId)];
    }
    else {
        renderingEngines = (0, getRenderingEngine_1.getRenderingEngines)();
    }
    const viewports = [];
    renderingEngines.forEach((renderingEngine) => {
        const viewportsForRenderingEngine = renderingEngine.getViewports();
        viewportsForRenderingEngine.forEach((viewport) => {
            if (viewport.hasImageURI(imageURI)) {
                viewports.push(viewport);
            }
        });
    });
    return viewports;
}
exports.default = getViewportsWithImageURI;
//# sourceMappingURL=getViewportsWithImageURI.js.map