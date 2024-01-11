"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const core_1 = require("@cornerstonejs/core");
const annotationState_1 = require("../stateManagement/annotation/annotationState");
const ToolGroupManager_1 = require("../store/ToolGroupManager");
const drawingSvg_1 = require("../drawingSvg");
const triggerAnnotationRenderForViewportIds_1 = __importDefault(require("../utilities/triggerAnnotationRenderForViewportIds"));
const AnnotationDisplayTool_1 = __importDefault(require("./base/AnnotationDisplayTool"));
const { EPSILON } = core_1.CONSTANTS;
class OverlayGridTool extends AnnotationDisplayTool_1.default {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            sourceImageIds: [],
        },
    }) {
        super(toolProps, defaultToolProps);
        this.onSetToolEnabled = () => {
            this._init();
        };
        this.onSetToolActive = () => {
            this._init();
        };
        this._init = () => {
            const sourceImageIds = this.configuration.sourceImageIds;
            if (!(sourceImageIds === null || sourceImageIds === void 0 ? void 0 : sourceImageIds.length)) {
                console.warn('OverlayGridTool: No sourceImageIds provided in configuration');
                return;
            }
            const imagePlaneModule = core_1.metaData.get('imagePlaneModule', sourceImageIds[0]);
            if (!imagePlaneModule) {
                console.warn('OverlayGridTool: No imagePlaneModule found for sourceImageIds');
                return;
            }
            const { frameOfReferenceUID } = imagePlaneModule;
            const viewportsInfo = (0, ToolGroupManager_1.getToolGroup)(this.toolGroupId).viewportsInfo;
            if (!(viewportsInfo === null || viewportsInfo === void 0 ? void 0 : viewportsInfo.length)) {
                console.warn('OverlayGridTool: No viewports found');
                return;
            }
            const annotations = (0, annotationState_1.getAnnotations)(this.getToolName(), frameOfReferenceUID);
            if (!(annotations === null || annotations === void 0 ? void 0 : annotations.length)) {
                const pointSets = sourceImageIds.map((id) => {
                    return this.calculateImageIdPointSets(id);
                });
                const newAnnotation = {
                    highlighted: true,
                    invalidated: true,
                    metadata: {
                        toolName: this.getToolName(),
                        FrameOfReferenceUID: frameOfReferenceUID,
                        referencedImageId: null,
                    },
                    data: {
                        viewportData: new Map(),
                        pointSets,
                    },
                };
                (0, annotationState_1.addAnnotation)(newAnnotation, frameOfReferenceUID);
            }
            (0, triggerAnnotationRenderForViewportIds_1.default)((0, core_1.getRenderingEngine)(viewportsInfo[0].renderingEngineId), viewportsInfo.map(({ viewportId }) => viewportId));
        };
        this.calculateImageIdPointSets = (imageId) => {
            const { imagePositionPatient, rows, columns, rowCosines, columnCosines, rowPixelSpacing, columnPixelSpacing, } = core_1.metaData.get('imagePlaneModule', imageId);
            const topLeft = [...imagePositionPatient];
            const topRight = [...imagePositionPatient];
            const bottomLeft = [...imagePositionPatient];
            const bottomRight = [...imagePositionPatient];
            gl_matrix_1.vec3.scaleAndAdd(topRight, imagePositionPatient, columnCosines, columns * columnPixelSpacing);
            gl_matrix_1.vec3.scaleAndAdd(bottomLeft, imagePositionPatient, rowCosines, rows * rowPixelSpacing);
            gl_matrix_1.vec3.scaleAndAdd(bottomRight, bottomLeft, columnCosines, columns * columnPixelSpacing);
            const pointSet1 = [topLeft, bottomLeft, topRight, bottomRight];
            const pointSet2 = [topLeft, topRight, bottomLeft, bottomRight];
            return { pointSet1, pointSet2 };
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            const sourceImageIds = this.configuration.sourceImageIds;
            let renderStatus = false;
            if (!(sourceImageIds === null || sourceImageIds === void 0 ? void 0 : sourceImageIds.length)) {
                return renderStatus;
            }
            const { viewport: targetViewport, FrameOfReferenceUID } = enabledElement;
            const targetImageIds = targetViewport.getImageIds();
            if (targetImageIds.length < 2) {
                return renderStatus;
            }
            const annotations = (0, annotationState_1.getAnnotations)(this.getToolName(), FrameOfReferenceUID);
            if (!(annotations === null || annotations === void 0 ? void 0 : annotations.length)) {
                return renderStatus;
            }
            const annotation = annotations[0];
            const { annotationUID } = annotation;
            const { focalPoint, viewPlaneNormal } = targetViewport.getCamera();
            const styleSpecifier = {
                toolGroupId: this.toolGroupId,
                toolName: this.getToolName(),
                viewportId: enabledElement.viewport.id,
            };
            const imageIdNormal = (this.getImageIdNormal(sourceImageIds[0]));
            if (this.isParallel(viewPlaneNormal, imageIdNormal)) {
                return renderStatus;
            }
            const targetViewportPlane = core_1.utilities.planar.planeEquation(viewPlaneNormal, focalPoint);
            const pointSets = annotation.data.pointSets;
            const viewportData = annotation.data.viewportData;
            for (let i = 0; i < sourceImageIds.length; i++) {
                const { pointSet1, pointSet2 } = pointSets[i];
                const targetData = viewportData.get(targetViewport.id) ||
                    this.initializeViewportData(viewportData, targetViewport.id);
                if (!targetData.pointSetsToUse[i]) {
                    let pointSetToUse = pointSet1;
                    let topBottomVec = gl_matrix_1.vec3.subtract(gl_matrix_1.vec3.create(), pointSet1[0], pointSet1[1]);
                    topBottomVec = gl_matrix_1.vec3.normalize(gl_matrix_1.vec3.create(), topBottomVec);
                    if (this.isPerpendicular(topBottomVec, viewPlaneNormal)) {
                        pointSetToUse = pointSet2;
                    }
                    targetData.pointSetsToUse[i] = pointSetToUse;
                    targetData.lineStartsWorld[i] = core_1.utilities.planar.linePlaneIntersection(pointSetToUse[0], pointSetToUse[1], targetViewportPlane);
                    targetData.lineEndsWorld[i] = core_1.utilities.planar.linePlaneIntersection(pointSetToUse[2], pointSetToUse[3], targetViewportPlane);
                }
                const lineStartWorld = targetData.lineStartsWorld[i];
                const lineEndWorld = targetData.lineEndsWorld[i];
                styleSpecifier.annotationUID = annotationUID;
                const lineWidth = this.getStyle('lineWidth', styleSpecifier, annotation);
                const lineDash = this.getStyle('lineDash', styleSpecifier, annotation);
                const color = this.getStyle('color', styleSpecifier, annotation);
                const shadow = this.getStyle('shadow', styleSpecifier, annotation);
                const canvasCoordinates = [lineStartWorld, lineEndWorld].map((world) => targetViewport.worldToCanvas(world));
                const dataId = `${annotationUID}-line`;
                const lineUID = `${i}`;
                (0, drawingSvg_1.drawLine)(svgDrawingHelper, annotationUID, lineUID, canvasCoordinates[0], canvasCoordinates[1], {
                    color,
                    width: lineWidth,
                    lineDash,
                    shadow,
                }, dataId);
            }
            renderStatus = true;
            return renderStatus;
        };
        this.initializeViewportData = (viewportData, id) => {
            viewportData.set(id, {
                pointSetsToUse: [],
                lineStartsWorld: [],
                lineEndsWorld: [],
            });
            return viewportData.get(id);
        };
        this.isPerpendicular = (vec1, vec2) => {
            const dot = gl_matrix_1.vec3.dot(vec1, vec2);
            return Math.abs(dot) < EPSILON;
        };
    }
    isParallel(vec1, vec2) {
        return Math.abs(gl_matrix_1.vec3.dot(vec1, vec2)) > 1 - EPSILON;
    }
    getImageIdNormal(imageId) {
        const { imageOrientationPatient } = core_1.metaData.get('imagePlaneModule', imageId);
        const rowCosineVec = gl_matrix_1.vec3.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
        const colCosineVec = gl_matrix_1.vec3.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
        return gl_matrix_1.vec3.cross(gl_matrix_1.vec3.create(), rowCosineVec, colCosineVec);
    }
}
OverlayGridTool.toolName = 'OverlayGrid';
exports.default = OverlayGridTool;
//# sourceMappingURL=OverlayGridTool.js.map