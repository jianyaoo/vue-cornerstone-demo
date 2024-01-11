"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const gl_matrix_1 = require("gl-matrix");
const enums_1 = require("../../enums");
const stateManagement_1 = require("../../stateManagement");
const annotationLocking_1 = require("../../stateManagement/annotation/annotationLocking");
const drawingSvg_1 = require("../../drawingSvg");
const viewportFilters_1 = require("../../utilities/viewportFilters");
const throttle_1 = __importDefault(require("../../utilities/throttle"));
const annotationVisibility_1 = require("../../stateManagement/annotation/annotationVisibility");
const elementCursor_1 = require("../../cursors/elementCursor");
const triggerAnnotationRenderForViewportIds_1 = __importDefault(require("../../utilities/triggerAnnotationRenderForViewportIds"));
const RectangleROITool_1 = __importDefault(require("../annotation/RectangleROITool"));
const { transformWorldToIndex } = core_1.utilities;
class RectangleROIStartEndThresholdTool extends RectangleROITool_1.default {
    constructor(toolProps = {}, defaultToolProps = {
        configuration: {
            numSlicesToPropagate: 10,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.addNewAnnotation = (evt) => {
            const eventDetail = evt.detail;
            const { currentPoints, element } = eventDetail;
            const worldPos = currentPoints.world;
            const enabledElement = (0, core_1.getEnabledElement)(element);
            const { viewport, renderingEngine } = enabledElement;
            this.isDrawing = true;
            const camera = viewport.getCamera();
            const { viewPlaneNormal, viewUp } = camera;
            let referencedImageId, imageVolume, volumeId;
            if (viewport instanceof core_1.StackViewport) {
                throw new Error('Stack Viewport Not implemented');
            }
            else {
                const targetId = this.getTargetId(viewport);
                volumeId = targetId.split('volumeId:')[1];
                imageVolume = core_1.cache.getVolume(volumeId);
                referencedImageId = core_1.utilities.getClosestImageId(imageVolume, worldPos, viewPlaneNormal);
            }
            if (!referencedImageId) {
                throw new Error('This tool does not work on non-acquisition planes');
            }
            const startIndex = viewport.getCurrentImageIdIndex();
            const spacingInNormal = core_1.utilities.getSpacingInNormalDirection(imageVolume, viewPlaneNormal);
            const endIndex = this._getEndSliceIndex(imageVolume, worldPos, spacingInNormal, viewPlaneNormal);
            const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
            const annotation = {
                highlighted: true,
                invalidated: true,
                metadata: {
                    viewPlaneNormal: [...viewPlaneNormal],
                    enabledElement,
                    viewUp: [...viewUp],
                    FrameOfReferenceUID,
                    referencedImageId,
                    toolName: this.getToolName(),
                    volumeId,
                    spacingInNormal,
                },
                data: {
                    label: '',
                    startSlice: startIndex,
                    endSlice: endIndex,
                    cachedStats: {
                        projectionPoints: [],
                        projectionPointsImageIds: [referencedImageId],
                    },
                    handles: {
                        textBox: {
                            hasMoved: false,
                            worldPosition: null,
                            worldBoundingBox: null,
                        },
                        points: [
                            [...worldPos],
                            [...worldPos],
                            [...worldPos],
                            [...worldPos],
                        ],
                        activeHandleIndex: null,
                    },
                    labelmapUID: null,
                },
            };
            this._computeProjectionPoints(annotation, imageVolume);
            (0, stateManagement_1.addAnnotation)(annotation, element);
            const viewportIdsToRender = (0, viewportFilters_1.getViewportIdsWithToolToRender)(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                handleIndex: 3,
                newAnnotation: true,
                hasMoved: false,
            };
            this._activateDraw(element);
            (0, elementCursor_1.hideElementCursor)(element);
            evt.preventDefault();
            (0, triggerAnnotationRenderForViewportIds_1.default)(renderingEngine, viewportIdsToRender);
            return annotation;
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            let renderStatus = false;
            const { viewport } = enabledElement;
            const annotations = (0, stateManagement_1.getAnnotations)(this.getToolName(), viewport.element);
            if (!(annotations === null || annotations === void 0 ? void 0 : annotations.length)) {
                return renderStatus;
            }
            const sliceIndex = viewport.getCurrentImageIdIndex();
            const styleSpecifier = {
                toolGroupId: this.toolGroupId,
                toolName: this.getToolName(),
                viewportId: enabledElement.viewport.id,
            };
            for (let i = 0; i < annotations.length; i++) {
                const annotation = annotations[i];
                const { annotationUID, data } = annotation;
                const { startSlice, endSlice } = data;
                const { points, activeHandleIndex } = data.handles;
                const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
                styleSpecifier.annotationUID = annotationUID;
                const lineWidth = this.getStyle('lineWidth', styleSpecifier, annotation);
                const lineDash = this.getStyle('lineDash', styleSpecifier, annotation);
                const color = this.getStyle('color', styleSpecifier, annotation);
                if (sliceIndex < Math.min(startSlice, endSlice) ||
                    sliceIndex > Math.max(startSlice, endSlice)) {
                    continue;
                }
                if (annotation.invalidated) {
                    this._throttledCalculateCachedStats(annotation, enabledElement);
                }
                let firstOrLastSlice = false;
                if (sliceIndex === startSlice || sliceIndex === endSlice) {
                    firstOrLastSlice = true;
                }
                if (!viewport.getRenderingEngine()) {
                    console.warn('Rendering Engine has been destroyed');
                    return renderStatus;
                }
                let activeHandleCanvasCoords;
                if (!(0, annotationVisibility_1.isAnnotationVisible)(annotationUID)) {
                    continue;
                }
                if (!(0, annotationLocking_1.isAnnotationLocked)(annotation) &&
                    !this.editData &&
                    activeHandleIndex !== null &&
                    firstOrLastSlice) {
                    activeHandleCanvasCoords = [canvasCoordinates[activeHandleIndex]];
                }
                if (activeHandleCanvasCoords) {
                    const handleGroupUID = '0';
                    (0, drawingSvg_1.drawHandles)(svgDrawingHelper, annotationUID, handleGroupUID, activeHandleCanvasCoords, {
                        color,
                    });
                }
                let lineDashToUse = lineDash;
                if (!firstOrLastSlice) {
                    lineDashToUse = 2;
                }
                const rectangleUID = '0';
                (0, drawingSvg_1.drawRect)(svgDrawingHelper, annotationUID, rectangleUID, canvasCoordinates[0], canvasCoordinates[3], {
                    color,
                    lineDash: lineDashToUse,
                    lineWidth,
                });
                renderStatus = true;
            }
            return renderStatus;
        };
        this._throttledCalculateCachedStats = (0, throttle_1.default)(this._calculateCachedStatsTool, 100, { trailing: true });
    }
    _computeProjectionPoints(annotation, imageVolume) {
        const { data, metadata } = annotation;
        const { viewPlaneNormal, spacingInNormal } = metadata;
        const { imageData } = imageVolume;
        const { startSlice, endSlice } = data;
        const { points } = data.handles;
        const startIJK = transformWorldToIndex(imageData, points[0]);
        if (startIJK[2] !== startSlice) {
            throw new Error('Start slice does not match');
        }
        const endIJK = gl_matrix_1.vec3.fromValues(startIJK[0], startIJK[1], endSlice);
        const startWorld = gl_matrix_1.vec3.create();
        imageData.indexToWorldVec3(startIJK, startWorld);
        const endWorld = gl_matrix_1.vec3.create();
        imageData.indexToWorldVec3(endIJK, endWorld);
        const distance = gl_matrix_1.vec3.distance(startWorld, endWorld);
        const newProjectionPoints = [];
        for (let dist = 0; dist < distance; dist += spacingInNormal) {
            newProjectionPoints.push(points.map((point) => {
                const newPoint = gl_matrix_1.vec3.create();
                gl_matrix_1.vec3.scaleAndAdd(newPoint, point, viewPlaneNormal, dist);
                return Array.from(newPoint);
            }));
        }
        data.cachedStats.projectionPoints = newProjectionPoints;
        const projectionPointsImageIds = [];
        for (const RectanglePoints of newProjectionPoints) {
            const imageId = core_1.utilities.getClosestImageId(imageVolume, RectanglePoints[0], viewPlaneNormal);
            projectionPointsImageIds.push(imageId);
        }
        data.cachedStats.projectionPointsImageIds = projectionPointsImageIds;
    }
    _calculateCachedStatsTool(annotation, enabledElement) {
        const data = annotation.data;
        const { viewportId, renderingEngineId, viewport } = enabledElement;
        const { cachedStats } = data;
        const volumeId = this.getTargetId(viewport);
        const imageVolume = core_1.cache.getVolume(volumeId.split('volumeId:')[1]);
        this._computeProjectionPoints(annotation, imageVolume);
        annotation.invalidated = false;
        const eventType = enums_1.Events.ANNOTATION_MODIFIED;
        const eventDetail = {
            annotation,
            viewportId,
            renderingEngineId,
        };
        (0, core_1.triggerEvent)(core_1.eventTarget, eventType, eventDetail);
        return cachedStats;
    }
    _getEndSliceIndex(imageVolume, worldPos, spacingInNormal, viewPlaneNormal) {
        const numSlicesToPropagate = this.configuration.numSlicesToPropagate;
        const endPos = gl_matrix_1.vec3.create();
        gl_matrix_1.vec3.scaleAndAdd(endPos, worldPos, viewPlaneNormal, numSlicesToPropagate * spacingInNormal);
        const halfSpacingInNormalDirection = spacingInNormal / 2;
        const { imageIds } = imageVolume;
        let imageIdIndex;
        for (let i = 0; i < imageIds.length; i++) {
            const imageId = imageIds[i];
            const { imagePositionPatient } = core_1.metaData.get('imagePlaneModule', imageId);
            const dir = gl_matrix_1.vec3.create();
            gl_matrix_1.vec3.sub(dir, endPos, imagePositionPatient);
            const dot = gl_matrix_1.vec3.dot(dir, viewPlaneNormal);
            if (Math.abs(dot) < halfSpacingInNormalDirection) {
                imageIdIndex = i;
            }
        }
        return imageIdIndex;
    }
}
RectangleROIStartEndThresholdTool.toolName = 'RectangleROIStartEndThreshold';
exports.default = RectangleROIStartEndThresholdTool;
//# sourceMappingURL=RectangleROIStartEndThresholdTool.js.map