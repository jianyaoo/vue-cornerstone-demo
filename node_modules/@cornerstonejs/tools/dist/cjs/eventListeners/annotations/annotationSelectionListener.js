"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const utilities_1 = require("../../utilities");
function annotationSelectionListener(evt) {
    const deselectedAnnotation = evt.detail.removed;
    if (!deselectedAnnotation.length) {
        return;
    }
    const renderingEngines = (0, core_1.getRenderingEngines)();
    renderingEngines.forEach((renderingEngine) => {
        const viewports = renderingEngine.getViewports();
        const viewportIds = viewports.map((vp) => vp.id);
        (0, utilities_1.triggerAnnotationRenderForViewportIds)(renderingEngine, viewportIds);
    });
}
exports.default = annotationSelectionListener;
//# sourceMappingURL=annotationSelectionListener.js.map