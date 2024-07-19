import getRenderingEngine, { getRenderingEngines, } from './RenderingEngine/getRenderingEngine';
export default function getEnabledElement(element) {
    if (!element) {
        return;
    }
    const { viewportUid, renderingEngineUid } = element.dataset;
    return getEnabledElementByIds(viewportUid, renderingEngineUid);
}
export function getEnabledElementByIds(viewportId, renderingEngineId) {
    if (!renderingEngineId || !viewportId) {
        return;
    }
    const renderingEngine = getRenderingEngine(renderingEngineId);
    if (!renderingEngine || renderingEngine.hasBeenDestroyed) {
        return;
    }
    const viewport = renderingEngine.getViewport(viewportId);
    if (!viewport) {
        return;
    }
    const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
    return {
        viewport,
        renderingEngine,
        viewportId,
        renderingEngineId,
        FrameOfReferenceUID,
    };
}
export function getEnabledElementByViewportId(viewportId) {
    const renderingEngines = getRenderingEngines();
    for (let i = 0; i < renderingEngines.length; i++) {
        const renderingEngine = renderingEngines[i];
        const viewport = renderingEngine.getViewport(viewportId);
        if (viewport) {
            return getEnabledElementByIds(viewportId, renderingEngine.id);
        }
    }
}
export function getEnabledElements() {
    const enabledElements = [];
    const renderingEngines = getRenderingEngines();
    renderingEngines.forEach((renderingEngine) => {
        const viewports = renderingEngine.getViewports();
        viewports.forEach(({ element }) => {
            enabledElements.push(getEnabledElement(element));
        });
    });
    return enabledElements;
}
//# sourceMappingURL=getEnabledElement.js.map