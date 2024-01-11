"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../../tools");
const store_1 = require("../../store");
const interpolateSegmentPoints_1 = __importDefault(require("./interpolation/interpolateSegmentPoints"));
function shouldPreventInterpolation(enabledElement, annotation, knotsRatioPercentage) {
    var _a;
    if (!((_a = annotation === null || annotation === void 0 ? void 0 : annotation.data) === null || _a === void 0 ? void 0 : _a.polyline) || knotsRatioPercentage <= 0) {
        return true;
    }
    if (!enabledElement.viewport) {
        return true;
    }
    const { renderingEngineId, viewportId, FrameOfReferenceUID } = enabledElement;
    const toolGroup = store_1.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (annotation.metadata.FrameOfReferenceUID !== FrameOfReferenceUID) {
        return true;
    }
    if (!toolGroup) {
        return true;
    }
    const toolInstance = toolGroup.getToolInstance(annotation.metadata.toolName);
    if (!(toolInstance instanceof tools_1.PlanarFreehandROITool)) {
        return true;
    }
    return (toolInstance.isDrawing ||
        toolInstance.isEditingOpen ||
        toolInstance.isEditingClosed);
}
function interpolateAnnotation(enabledElement, annotation, knotsRatioPercentage) {
    if (shouldPreventInterpolation(enabledElement, annotation, knotsRatioPercentage)) {
        return false;
    }
    const { viewport } = enabledElement;
    const canvasPoints = annotation.data.polyline.map(viewport.worldToCanvas);
    const interpolatedCanvasPoints = ((0, interpolateSegmentPoints_1.default)(canvasPoints, 0, canvasPoints.length, knotsRatioPercentage));
    if (interpolatedCanvasPoints === canvasPoints) {
        return false;
    }
    annotation.data.polyline = interpolatedCanvasPoints.map(viewport.canvasToWorld);
    return true;
}
exports.default = interpolateAnnotation;
//# sourceMappingURL=interpolateAnnotation.js.map