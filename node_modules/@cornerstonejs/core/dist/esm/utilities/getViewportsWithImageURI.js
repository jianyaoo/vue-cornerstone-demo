import { getRenderingEngine } from '../RenderingEngine';
import { getRenderingEngines } from '../RenderingEngine/getRenderingEngine';
export default function getViewportsWithImageURI(imageURI, renderingEngineId) {
    let renderingEngines;
    if (renderingEngineId) {
        renderingEngines = [getRenderingEngine(renderingEngineId)];
    }
    else {
        renderingEngines = getRenderingEngines();
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
//# sourceMappingURL=getViewportsWithImageURI.js.map