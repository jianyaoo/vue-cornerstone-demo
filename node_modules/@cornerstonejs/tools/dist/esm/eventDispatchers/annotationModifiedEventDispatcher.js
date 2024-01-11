import { eventTarget, getRenderingEngine } from '@cornerstonejs/core';
import Events from '../enums/Events';
import triggerAnnotationRenderForViewportIds from '../utilities/triggerAnnotationRenderForViewportIds';
const onAnnotationModified = function (evt) {
    const { viewportId, renderingEngineId } = evt.detail;
    const renderingEngine = getRenderingEngine(renderingEngineId);
    triggerAnnotationRenderForViewportIds(renderingEngine, [viewportId]);
};
const enable = function () {
    eventTarget.addEventListener(Events.ANNOTATION_MODIFIED, onAnnotationModified);
};
const disable = function () {
    eventTarget.removeEventListener(Events.ANNOTATION_MODIFIED, onAnnotationModified);
};
export default {
    enable,
    disable,
};
//# sourceMappingURL=annotationModifiedEventDispatcher.js.map