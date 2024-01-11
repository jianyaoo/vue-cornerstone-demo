"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnnotationNearPointOnEnabledElement = exports.getAnnotationNearPoint = void 0;
const core_1 = require("@cornerstonejs/core");
const annotationState_1 = require("../stateManagement/annotation/annotationState");
const ToolGroupManager = __importStar(require("../store/ToolGroupManager"));
function getAnnotationNearPoint(element, canvasPoint, proximity = 5) {
    const enabledElement = (0, core_1.getEnabledElement)(element);
    if (!enabledElement) {
        throw new Error('getAnnotationNearPoint: enabledElement not found');
    }
    return getAnnotationNearPointOnEnabledElement(enabledElement, canvasPoint, proximity);
}
exports.getAnnotationNearPoint = getAnnotationNearPoint;
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
exports.getAnnotationNearPointOnEnabledElement = getAnnotationNearPointOnEnabledElement;
function findAnnotationNearPointByTool(tool, enabledElement, point, proximity) {
    var _a, _b;
    const { viewport } = enabledElement;
    const annotations = (0, annotationState_1.getAnnotations)(tool.constructor.toolName, viewport === null || viewport === void 0 ? void 0 : viewport.element);
    const currentId = (_a = viewport === null || viewport === void 0 ? void 0 : viewport.getCurrentImageId) === null || _a === void 0 ? void 0 : _a.call(viewport);
    if (annotations === null || annotations === void 0 ? void 0 : annotations.length) {
        const { element } = enabledElement.viewport;
        for (const annotation of annotations) {
            const referencedImageId = (_b = annotation.metadata) === null || _b === void 0 ? void 0 : _b.referencedImageId;
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
//# sourceMappingURL=getAnnotationNearPoint.js.map