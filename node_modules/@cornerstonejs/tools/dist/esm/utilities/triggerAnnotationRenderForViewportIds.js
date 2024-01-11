import triggerAnnotationRender from './triggerAnnotationRender';
export function triggerAnnotationRenderForViewportIds(renderingEngine, viewportIdsToRender) {
    if (!viewportIdsToRender.length) {
        return;
    }
    viewportIdsToRender.forEach((viewportId) => {
        const { element } = renderingEngine.getViewport(viewportId);
        triggerAnnotationRender(element);
    });
}
export default triggerAnnotationRenderForViewportIds;
//# sourceMappingURL=triggerAnnotationRenderForViewportIds.js.map