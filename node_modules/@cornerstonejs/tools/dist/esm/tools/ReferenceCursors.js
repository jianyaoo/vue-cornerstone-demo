import { getEnabledElement, StackViewport, VolumeViewport, utilities, getEnabledElementByIds, } from '@cornerstonejs/core';
import { addAnnotation, getAnnotations, } from '../stateManagement/annotation/annotationState';
import { isAnnotationVisible } from '../stateManagement/annotation/annotationVisibility';
import { drawLine } from '../drawingSvg';
import { getViewportIdsWithToolToRender } from '../utilities/viewportFilters';
import triggerAnnotationRenderForViewportIds from '../utilities/triggerAnnotationRenderForViewportIds';
import { vec3 } from 'gl-matrix';
import AnnotationDisplayTool from './base/AnnotationDisplayTool';
import vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { hideElementCursor, resetElementCursor, } from '../cursors/elementCursor';
import { getToolGroup } from '../store/ToolGroupManager';
class ReferenceCursors extends AnnotationDisplayTool {
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
            const enabledElement = getEnabledElement(element);
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
            const annotations = getAnnotations(this.getToolName(), element);
            if (annotations.length > 0) {
                return null;
            }
            const annotationId = addAnnotation(annotation, element);
            if (annotationId === null) {
                return;
            }
            const viewportIdsToRender = getViewportIdsWithToolToRender(element, this.getToolName(), false);
            triggerAnnotationRenderForViewportIds(renderingEngine, viewportIdsToRender);
        };
        this.onCameraModified = (evt) => {
            const eventDetail = evt.detail;
            const { element, previousCamera, camera } = eventDetail;
            const enabledElement = getEnabledElement(element);
            const viewport = enabledElement.viewport;
            if (element !== this._elementWithCursor) {
                return;
            }
            const oldFocalPoint = previousCamera.focalPoint;
            const cameraNormal = camera.viewPlaneNormal;
            const newFocalPoint = camera.focalPoint;
            const deltaCameraFocalPoint = [0, 0, 0];
            vtkMath.subtract(newFocalPoint, oldFocalPoint, deltaCameraFocalPoint);
            if (deltaCameraFocalPoint.reduce((a, b) => a + b, 0) === 0) {
                return;
            }
            const dotProduct = vtkMath.dot(deltaCameraFocalPoint, cameraNormal);
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
            let annotations = getAnnotations(this.getToolName(), element);
            if (!annotations?.length) {
                return renderStatus;
            }
            annotations = this.filterInteractableAnnotationsForElement(element, annotations);
            if (!annotations?.length) {
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
                if (!isAnnotationVisible(annotationUID)) {
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
                drawLine(svgDrawingHelper, annotationUID, crosshairUIDs.upper, [x, y - (centerSpace / 2 + lineLength)], [x, y - centerSpace / 2], { color, lineDash, lineWidth });
                drawLine(svgDrawingHelper, annotationUID, crosshairUIDs.lower, [x, y + (centerSpace / 2 + lineLength)], [x, y + centerSpace / 2], { color, lineDash, lineWidth });
                drawLine(svgDrawingHelper, annotationUID, crosshairUIDs.right, [x + (centerSpace / 2 + lineLength), y], [x + centerSpace / 2, y], { color, lineDash, lineWidth });
                drawLine(svgDrawingHelper, annotationUID, crosshairUIDs.left, [x - (centerSpace / 2 + lineLength), y], [x - centerSpace / 2, y], { color, lineDash, lineWidth });
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
        const viewportIds = getToolGroup(this.toolGroupId).viewportsInfo;
        if (!viewportIds) {
            return;
        }
        const enabledElements = viewportIds.map((e) => getEnabledElementByIds(e.viewportId, e.renderingEngineId));
        enabledElements.forEach((element) => {
            if (element) {
                hideElementCursor(element.viewport.element);
            }
        });
    }
    onSetToolDisabled() {
        if (!this._disableCursorEnabled) {
            return;
        }
        const viewportIds = getToolGroup(this.toolGroupId).viewportsInfo;
        if (!viewportIds) {
            return;
        }
        const enabledElements = viewportIds.map((e) => getEnabledElementByIds(e.viewportId, e.renderingEngineId));
        enabledElements.forEach((element) => {
            if (element) {
                resetElementCursor(element.viewport.element);
            }
        });
    }
    getActiveAnnotation(element) {
        const annotations = getAnnotations(this.getToolName(), element);
        if (!annotations.length) {
            return null;
        }
        const targetAnnotation = annotations[0];
        return targetAnnotation;
    }
    updateAnnotationPosition(element, annotation) {
        const worldPos = this._currentCursorWorldPosition;
        if (!worldPos) {
            return;
        }
        if (!annotation.data?.handles?.points) {
            return;
        }
        annotation.data.handles.points = [[...worldPos]];
        annotation.invalidated = true;
        const viewportIdsToRender = getViewportIdsWithToolToRender(element, this.getToolName(), false);
        const enabledElement = getEnabledElement(element);
        if (!enabledElement) {
            return;
        }
        const { renderingEngine } = enabledElement;
        triggerAnnotationRenderForViewportIds(renderingEngine, viewportIdsToRender);
    }
    filterInteractableAnnotationsForElement(element, annotations) {
        if (!(annotations instanceof Array) || annotations.length === 0) {
            return [];
        }
        const annotation = annotations[0];
        const viewport = getEnabledElement(element)?.viewport;
        if (!viewport) {
            return [];
        }
        const camera = viewport.getCamera();
        const { viewPlaneNormal, focalPoint } = camera;
        if (!viewPlaneNormal || !focalPoint) {
            return [];
        }
        const points = annotation.data?.handles?.points;
        if (!(points instanceof Array) || points.length !== 1) {
            return [];
        }
        const worldPos = points[0];
        const plane = utilities.planar.planeEquation(viewPlaneNormal, focalPoint);
        const distance = utilities.planar.planeDistanceToPoint(plane, worldPos);
        return distance < this.configuration.displayThreshold ? [annotation] : [];
    }
    updateViewportImage(viewport) {
        const currentMousePosition = this._currentCursorWorldPosition;
        if (!currentMousePosition || currentMousePosition.some((e) => isNaN(e))) {
            return;
        }
        if (viewport instanceof StackViewport) {
            const closestIndex = utilities.getClosestStackImageIndexForPoint(currentMousePosition, viewport);
            if (closestIndex === null) {
                return;
            }
            if (closestIndex !== viewport.getCurrentImageIdIndex()) {
                viewport.setImageIdIndex(closestIndex);
            }
        }
        else if (viewport instanceof VolumeViewport) {
            const { focalPoint, viewPlaneNormal } = viewport.getCamera();
            if (!focalPoint || !viewPlaneNormal) {
                return;
            }
            const plane = utilities.planar.planeEquation(viewPlaneNormal, focalPoint);
            const currentDistance = utilities.planar.planeDistanceToPoint(plane, currentMousePosition, true);
            if (Math.abs(currentDistance) < 0.5) {
                return;
            }
            const normalizedViewPlane = vec3.normalize(vec3.create(), vec3.fromValues(...viewPlaneNormal));
            const scaledPlaneNormal = vec3.scale(vec3.create(), normalizedViewPlane, currentDistance);
            const newFocalPoint = vec3.add(vec3.create(), vec3.fromValues(...focalPoint), scaledPlaneNormal);
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
export default ReferenceCursors;
//# sourceMappingURL=ReferenceCursors.js.map