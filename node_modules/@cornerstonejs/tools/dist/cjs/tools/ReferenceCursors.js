"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const annotationState_1 = require("../stateManagement/annotation/annotationState");
const annotationVisibility_1 = require("../stateManagement/annotation/annotationVisibility");
const drawingSvg_1 = require("../drawingSvg");
const viewportFilters_1 = require("../utilities/viewportFilters");
const triggerAnnotationRenderForViewportIds_1 = __importDefault(require("../utilities/triggerAnnotationRenderForViewportIds"));
const gl_matrix_1 = require("gl-matrix");
const AnnotationDisplayTool_1 = __importDefault(require("./base/AnnotationDisplayTool"));
const Math_1 = __importDefault(require("@kitware/vtk.js/Common/Core/Math"));
const elementCursor_1 = require("../cursors/elementCursor");
const ToolGroupManager_1 = require("../store/ToolGroupManager");
class ReferenceCursors extends AnnotationDisplayTool_1.default {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            shadow: true,
            preventHandleOutsideImage: false,
            displayThreshold: 5,
            positionSync: true,
            disableCursor: false,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.isDrawing = false;
        this.isHandleOutsideImage = false;
        this._elementWithCursor = null;
        this._currentCursorWorldPosition = null;
        this._currentCanvasPosition = null;
        this._disableCursorEnabled = false;
        this.mouseMoveCallback = (evt) => {
            const { detail } = evt;
            const { element, currentPoints } = detail;
            this._currentCursorWorldPosition = currentPoints.world;
            this._currentCanvasPosition = currentPoints.canvas;
            this._elementWithCursor = element;
            const annotation = this.getActiveAnnotation(element);
            if (annotation === null) {
                this.createInitialAnnotation(currentPoints.world, element);
                return false;
            }
            this.updateAnnotationPosition(element, annotation);
            return false;
        };
        this.createInitialAnnotation = (worldPos, element) => {
            const enabledElement = (0, core_1.getEnabledElement)(element);
            if (!enabledElement) {
                throw new Error('No enabled element found');
            }
            const { viewport, renderingEngine } = enabledElement;
            this.isDrawing = true;
            const camera = viewport.getCamera();
            const { viewPlaneNormal, viewUp } = camera;
            if (!viewPlaneNormal || !viewUp) {
                throw new Error('Camera not found');
            }
            const referencedImageId = this.getReferencedImageId(viewport, worldPos, viewPlaneNormal, viewUp);
            const FrameOfReferenceUID = viewport.getFrameOfReferenceUID();
            const annotation = {
                highlighted: true,
                invalidated: true,
                metadata: {
                    toolName: this.getToolName(),
                    viewPlaneNormal: [...viewPlaneNormal],
                    viewUp: [...viewUp],
                    FrameOfReferenceUID,
                    referencedImageId,
                },
                data: {
                    label: '',
                    handles: {
                        points: [[...worldPos]],
                        activeHandleIndex: null,
                        textBox: {
                            hasMoved: false,
                            worldPosition: [0, 0, 0],
                            worldBoundingBox: {
                                topLeft: [0, 0, 0],
                                topRight: [0, 0, 0],
                                bottomLeft: [0, 0, 0],
                                bottomRight: [0, 0, 0],
                            },
                        },
                    },
                },
            };
            const annotations = (0, annotationState_1.getAnnotations)(this.getToolName(), element);
            if (annotations.length > 0) {
                return null;
            }
            const annotationId = (0, annotationState_1.addAnnotation)(annotation, element);
            if (annotationId === null) {
                return;
            }
            const viewportIdsToRender = (0, viewportFilters_1.getViewportIdsWithToolToRender)(element, this.getToolName(), false);
            (0, triggerAnnotationRenderForViewportIds_1.default)(renderingEngine, viewportIdsToRender);
        };
        this.onCameraModified = (evt) => {
            const eventDetail = evt.detail;
            const { element, previousCamera, camera } = eventDetail;
            const enabledElement = (0, core_1.getEnabledElement)(element);
            const viewport = enabledElement.viewport;
            if (element !== this._elementWithCursor) {
                return;
            }
            const oldFocalPoint = previousCamera.focalPoint;
            const cameraNormal = camera.viewPlaneNormal;
            const newFocalPoint = camera.focalPoint;
            const deltaCameraFocalPoint = [0, 0, 0];
            Math_1.default.subtract(newFocalPoint, oldFocalPoint, deltaCameraFocalPoint);
            if (deltaCameraFocalPoint.reduce((a, b) => a + b, 0) === 0) {
                return;
            }
            const dotProduct = Math_1.default.dot(deltaCameraFocalPoint, cameraNormal);
            if (Math.abs(dotProduct) < 1e-2) {
                return;
            }
            if (!this._currentCanvasPosition) {
                return;
            }
            const newWorldPos = viewport.canvasToWorld(this._currentCanvasPosition);
            this._currentCursorWorldPosition = newWorldPos;
            this.updateAnnotationPosition(element, this.getActiveAnnotation(element));
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            let renderStatus = false;
            const { viewport, FrameOfReferenceUID } = enabledElement;
            const isElementWithCursor = this._elementWithCursor === viewport.element;
            if (this.configuration.positionSync && !isElementWithCursor) {
                this.updateViewportImage(viewport);
            }
            const { element } = viewport;
            let annotations = (0, annotationState_1.getAnnotations)(this.getToolName(), element);
            if (!(annotations === null || annotations === void 0 ? void 0 : annotations.length)) {
                return renderStatus;
            }
            annotations = this.filterInteractableAnnotationsForElement(element, annotations);
            if (!(annotations === null || annotations === void 0 ? void 0 : annotations.length)) {
                return renderStatus;
            }
            const styleSpecifier = {
                toolGroupId: this.toolGroupId,
                toolName: this.getToolName(),
                viewportId: enabledElement.viewport.id,
            };
            for (let i = 0; i < annotations.length; i++) {
                const annotation = annotations[i];
                const { annotationUID, data } = annotation;
                const { handles } = data;
                const { points } = handles;
                if (!annotationUID) {
                    return renderStatus;
                }
                styleSpecifier.annotationUID = annotationUID;
                const lineWidthBase = parseFloat(this.getStyle('lineWidth', styleSpecifier, annotation));
                const lineWidth = typeof lineWidthBase === 'number' && isElementWithCursor
                    ? lineWidthBase
                    : lineWidthBase;
                const lineDash = this.getStyle('lineDash', styleSpecifier, annotation);
                const color = this.getStyle('color', styleSpecifier, annotation);
                if (points[0].some((e) => isNaN(e))) {
                    return renderStatus;
                }
                const canvasCoordinates = points.map((p) => viewport.worldToCanvas(p));
                if (!viewport.getRenderingEngine()) {
                    console.warn('Rendering Engine has been destroyed');
                    return renderStatus;
                }
                if (!(0, annotationVisibility_1.isAnnotationVisible)(annotationUID)) {
                    continue;
                }
                const crosshairUIDs = {
                    upper: 'upper',
                    right: 'right',
                    lower: 'lower',
                    left: 'left',
                };
                const [x, y] = canvasCoordinates[0];
                const centerSpace = isElementWithCursor ? 20 : 7;
                const lineLength = isElementWithCursor ? 5 : 7;
                (0, drawingSvg_1.drawLine)(svgDrawingHelper, annotationUID, crosshairUIDs.upper, [x, y - (centerSpace / 2 + lineLength)], [x, y - centerSpace / 2], { color, lineDash, lineWidth });
                (0, drawingSvg_1.drawLine)(svgDrawingHelper, annotationUID, crosshairUIDs.lower, [x, y + (centerSpace / 2 + lineLength)], [x, y + centerSpace / 2], { color, lineDash, lineWidth });
                (0, drawingSvg_1.drawLine)(svgDrawingHelper, annotationUID, crosshairUIDs.right, [x + (centerSpace / 2 + lineLength), y], [x + centerSpace / 2, y], { color, lineDash, lineWidth });
                (0, drawingSvg_1.drawLine)(svgDrawingHelper, annotationUID, crosshairUIDs.left, [x - (centerSpace / 2 + lineLength), y], [x - centerSpace / 2, y], { color, lineDash, lineWidth });
                renderStatus = true;
            }
            return renderStatus;
        };
        this._disableCursorEnabled = this.configuration.disableCursor;
    }
    onSetToolActive() {
        this._disableCursorEnabled = this.configuration.disableCursor;
        if (!this._disableCursorEnabled) {
            return;
        }
        const viewportIds = (0, ToolGroupManager_1.getToolGroup)(this.toolGroupId).viewportsInfo;
        if (!viewportIds) {
            return;
        }
        const enabledElements = viewportIds.map((e) => (0, core_1.getEnabledElementByIds)(e.viewportId, e.renderingEngineId));
        enabledElements.forEach((element) => {
            if (element) {
                (0, elementCursor_1.hideElementCursor)(element.viewport.element);
            }
        });
    }
    onSetToolDisabled() {
        if (!this._disableCursorEnabled) {
            return;
        }
        const viewportIds = (0, ToolGroupManager_1.getToolGroup)(this.toolGroupId).viewportsInfo;
        if (!viewportIds) {
            return;
        }
        const enabledElements = viewportIds.map((e) => (0, core_1.getEnabledElementByIds)(e.viewportId, e.renderingEngineId));
        enabledElements.forEach((element) => {
            if (element) {
                (0, elementCursor_1.resetElementCursor)(element.viewport.element);
            }
        });
    }
    getActiveAnnotation(element) {
        const annotations = (0, annotationState_1.getAnnotations)(this.getToolName(), element);
        if (!annotations.length) {
            return null;
        }
        const targetAnnotation = annotations[0];
        return targetAnnotation;
    }
    updateAnnotationPosition(element, annotation) {
        var _a, _b;
        const worldPos = this._currentCursorWorldPosition;
        if (!worldPos) {
            return;
        }
        if (!((_b = (_a = annotation.data) === null || _a === void 0 ? void 0 : _a.handles) === null || _b === void 0 ? void 0 : _b.points)) {
            return;
        }
        annotation.data.handles.points = [[...worldPos]];
        annotation.invalidated = true;
        const viewportIdsToRender = (0, viewportFilters_1.getViewportIdsWithToolToRender)(element, this.getToolName(), false);
        const enabledElement = (0, core_1.getEnabledElement)(element);
        if (!enabledElement) {
            return;
        }
        const { renderingEngine } = enabledElement;
        (0, triggerAnnotationRenderForViewportIds_1.default)(renderingEngine, viewportIdsToRender);
    }
    filterInteractableAnnotationsForElement(element, annotations) {
        var _a, _b, _c;
        if (!(annotations instanceof Array) || annotations.length === 0) {
            return [];
        }
        const annotation = annotations[0];
        const viewport = (_a = (0, core_1.getEnabledElement)(element)) === null || _a === void 0 ? void 0 : _a.viewport;
        if (!viewport) {
            return [];
        }
        const camera = viewport.getCamera();
        const { viewPlaneNormal, focalPoint } = camera;
        if (!viewPlaneNormal || !focalPoint) {
            return [];
        }
        const points = (_c = (_b = annotation.data) === null || _b === void 0 ? void 0 : _b.handles) === null || _c === void 0 ? void 0 : _c.points;
        if (!(points instanceof Array) || points.length !== 1) {
            return [];
        }
        const worldPos = points[0];
        const plane = core_1.utilities.planar.planeEquation(viewPlaneNormal, focalPoint);
        const distance = core_1.utilities.planar.planeDistanceToPoint(plane, worldPos);
        return distance < this.configuration.displayThreshold ? [annotation] : [];
    }
    updateViewportImage(viewport) {
        const currentMousePosition = this._currentCursorWorldPosition;
        if (!currentMousePosition || currentMousePosition.some((e) => isNaN(e))) {
            return;
        }
        if (viewport instanceof core_1.StackViewport) {
            const closestIndex = core_1.utilities.getClosestStackImageIndexForPoint(currentMousePosition, viewport);
            if (closestIndex === null) {
                return;
            }
            if (closestIndex !== viewport.getCurrentImageIdIndex()) {
                viewport.setImageIdIndex(closestIndex);
            }
        }
        else if (viewport instanceof core_1.VolumeViewport) {
            const { focalPoint, viewPlaneNormal } = viewport.getCamera();
            if (!focalPoint || !viewPlaneNormal) {
                return;
            }
            const plane = core_1.utilities.planar.planeEquation(viewPlaneNormal, focalPoint);
            const currentDistance = core_1.utilities.planar.planeDistanceToPoint(plane, currentMousePosition, true);
            if (Math.abs(currentDistance) < 0.5) {
                return;
            }
            const normalizedViewPlane = gl_matrix_1.vec3.normalize(gl_matrix_1.vec3.create(), gl_matrix_1.vec3.fromValues(...viewPlaneNormal));
            const scaledPlaneNormal = gl_matrix_1.vec3.scale(gl_matrix_1.vec3.create(), normalizedViewPlane, currentDistance);
            const newFocalPoint = gl_matrix_1.vec3.add(gl_matrix_1.vec3.create(), gl_matrix_1.vec3.fromValues(...focalPoint), scaledPlaneNormal);
            const isInBounds = true;
            if (isInBounds) {
                viewport.setCamera({ focalPoint: newFocalPoint });
                const renderingEngine = viewport.getRenderingEngine();
                if (renderingEngine) {
                    renderingEngine.renderViewport(viewport.id);
                }
            }
        }
    }
}
ReferenceCursors.toolName = 'ReferenceCursors';
exports.default = ReferenceCursors;
//# sourceMappingURL=ReferenceCursors.js.map