import { PlanarFreehandROITool } from '../../tools';
import { ToolGroupManager } from '../../store';
import interpolateSegmentPoints from './interpolation/interpolateSegmentPoints';
function shouldPreventInterpolation(enabledElement, annotation, knotsRatioPercentage) {
    if (!annotation?.data?.polyline || knotsRatioPercentage <= 0) {
        return true;
    }
    if (!enabledElement.viewport) {
        return true;
    }
    const { renderingEngineId, viewportId, FrameOfReferenceUID } = enabledElement;
    const toolGroup = ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (annotation.metadata.FrameOfReferenceUID !== FrameOfReferenceUID) {
        return true;
    }
    if (!toolGroup) {
        return true;
    }
    const toolInstance = toolGroup.getToolInstance(annotation.metadata.toolName);
    if (!(toolInstance instanceof PlanarFreehandROITool)) {
        return true;
    }
    return (toolInstance.isDrawing ||
        toolInstance.isEditingOpen ||
        toolInstance.isEditingClosed);
}
export default function interpolateAnnotation(enabledElement, annotation, knotsRatioPercentage) {
    if (shouldPreventInterpolation(enabledElement, annotation, knotsRatioPercentage)) {
        return false;
    }
    const { viewport } = enabledElement;
    const canvasPoints = annotation.data.polyline.map(viewport.worldToCanvas);
    const interpolatedCanvasPoints = (interpolateSegmentPoints(canvasPoints, 0, canvasPoints.length, knotsRatioPercentage));
    if (interpolatedCanvasPoints === canvasPoints) {
        return false;
    }
    annotation.data.polyline = interpolatedCanvasPoints.map(viewport.canvasToWorld);
    return true;
}
//# sourceMappingURL=interpolateAnnotation.js.map