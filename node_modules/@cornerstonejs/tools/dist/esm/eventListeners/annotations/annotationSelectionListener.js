import { getRenderingEngines } from '@cornerstonejs/core';
import { triggerAnnotationRenderForViewportIds } from '../../utilities';
function annotationSelectionListener(evt) {
    const deselectedAnnotation = evt.detail.removed;
    if (!deselectedAnnotation.length) {
        return;
    }
    const renderingEngines = getRenderingEngines();
    renderingEngines.forEach((renderingEngine) => {
        const viewports = renderingEngine.getViewports();
        const viewportIds = viewports.map((vp) => vp.id);
        triggerAnnotationRenderForViewportIds(renderingEngine, viewportIds);
    });
}
export default annotationSelectionListener;
//# sourceMappingURL=annotationSelectionListener.js.map