import { getEnabledElement } from '@cornerstonejs/core';
import filterViewportsWithFrameOfReferenceUID from './filterViewportsWithFrameOfReferenceUID';
import filterViewportsWithToolEnabled from './filterViewportsWithToolEnabled';
import filterViewportsWithParallelNormals from './filterViewportsWithParallelNormals';
export default function getViewportIdsWithToolToRender(element, toolName, requireParallelNormals = true) {
    const enabledElement = getEnabledElement(element);
    const { renderingEngine, FrameOfReferenceUID } = enabledElement;
    let viewports = renderingEngine.getViewports();
    viewports = filterViewportsWithFrameOfReferenceUID(viewports, FrameOfReferenceUID);
    viewports = filterViewportsWithToolEnabled(viewports, toolName);
    const viewport = renderingEngine.getViewport(enabledElement.viewportId);
    if (requireParallelNormals) {
        viewports = filterViewportsWithParallelNormals(viewports, viewport.getCamera());
    }
    const viewportIds = viewports.map((vp) => vp.id);
    return viewportIds;
}
//# sourceMappingURL=getViewportIdsWithToolToRender.js.map