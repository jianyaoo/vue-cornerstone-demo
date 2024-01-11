import { getEnabledElement } from '@cornerstonejs/core';
import { getAnnotations } from '../stateManagement/annotation/annotationState';
import * as ToolGroupManager from '../store/ToolGroupManager';
function getAnnotationNearPoint(element, canvasPoint, proximity = 5) {
    const enabledElement = getEnabledElement(element);
    if (!enabledElement) {
        throw new Error('getAnnotationNearPoint: enabledElement not found');
    }
    return getAnnotationNearPointOnEnabledElement(enabledElement, canvasPoint, proximity);
}
function getAnnotationNearPointOnEnabledElement(enabledElement, point, proximity) {
    const { renderingEngineId, viewportId } = enabledElement;
    const toolGroup = ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
        return null;
    }
    const { _toolInstances: tools } = toolGroup;
    for (const name in tools) {
        const found = findAnnotationNearPointByTool(tools[name], enabledElement, point, proximity);
        if (found) {
            return found;
        }
    }
    return null;
}
function findAnnotationNearPointByTool(tool, enabledElement, point, proximity) {
    const { viewport } = enabledElement;
    const annotations = getAnnotations(tool.constructor.toolName, viewport?.element);
    const currentId = viewport?.getCurrentImageId?.();
    if (annotations?.length) {
        const { element } = enabledElement.viewport;
        for (const annotation of annotations) {
            const referencedImageId = annotation.metadata?.referencedImageId;
            if ((currentId && referencedImageId && currentId !== referencedImageId) ||
                !tool.isPointNearTool) {
                continue;
            }
            if (tool.isPointNearTool(element, annotation, point, proximity, '') ||
                tool.getHandleNearImagePoint(element, annotation, point, proximity)) {
                return annotation;
            }
        }
    }
    return null;
}
export { getAnnotationNearPoint, getAnnotationNearPointOnEnabledElement };
//# sourceMappingURL=getAnnotationNearPoint.js.map