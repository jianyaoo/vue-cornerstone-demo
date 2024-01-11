import { getRenderingEngine } from '@cornerstonejs/core';
import triggerAnnotationRenderForViewportIds from '../../utilities/triggerAnnotationRenderForViewportIds';
function annotationModifiedListener(evt) {
    const { viewportId, renderingEngineId } = evt.detail;
    const renderingEngine = getRenderingEngine(renderingEngineId);
    triggerAnnotationRenderForViewportIds(renderingEngine, [viewportId]);
}
export default annotationModifiedListener;
//# sourceMappingURL=annotationModifiedListener.js.map