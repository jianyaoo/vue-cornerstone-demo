import { getEnabledElement, cache, StackViewport, metaData, triggerEvent, eventTarget, utilities as csUtils, } from '@cornerstonejs/core';
import { vec3 } from 'gl-matrix';
import { Events } from '../../enums';
import { addAnnotation, getAnnotations } from '../../stateManagement';
import { isAnnotationLocked } from '../../stateManagement/annotation/annotationLocking';
import { drawHandles as drawHandlesSvg, drawRect as drawRectSvg, } from '../../drawingSvg';
import { getViewportIdsWithToolToRender } from '../../utilities/viewportFilters';
import throttle from '../../utilities/throttle';
import { isAnnotationVisible } from '../../stateManagement/annotation/annotationVisibility';
import { hideElementCursor } from '../../cursors/elementCursor';
import triggerAnnotationRenderForViewportIds from '../../utilities/triggerAnnotationRenderForViewportIds';
import RectangleROITool from '../annotation/RectangleROITool';
const { transformWorldToIndex } = csUtils;
class RectangleROIStartEndThresholdTool extends RectangleROITool {
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
            const enabledElement = getEnabledElement(element);
            const { viewport, renderingEngine } = enabledElement;
            this.isDrawing = true;
            const camera = viewport.getCamera();
            const { viewPlaneNormal, viewUp } = camera;
            let referencedImageId, imageVolume, volumeId;
            if (viewport instanceof StackViewport) {
                throw new Error('Stack Viewport Not implemented');
            }
            else {
                const targetId = this.getTargetId(viewport);
                volumeId = targetId.split('volumeId:')[1];
                imageVolume = cache.getVolume(volumeId);
                referencedImageId = csUtils.getClosestImageId(imageVolume, worldPos, viewPlaneNormal);
            }
            if (!referencedImageId) {
                throw new Error('This tool does not work on non-acquisition planes');
            }
            const startIndex = viewport.getCurrentImageIdIndex();
            const spacingInNormal = csUtils.getSpacingInNormalDirection(imageVolume, viewPlaneNormal);
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
            addAnnotation(annotation, element);
            const viewportIdsToRender = getViewportIdsWithToolToRender(element, this.getToolName());
            this.editData = {
                annotation,
                viewportIdsToRender,
                handleIndex: 3,
                newAnnotation: true,
                hasMoved: false,
            };
            this._activateDraw(element);
            hideElementCursor(element);
            evt.preventDefault();
            triggerAnnotationRenderForViewportIds(renderingEngine, viewportIdsToRender);
            return annotation;
        };
        this.renderAnnotation = (enabledElement, svgDrawingHelper) => {
            let renderStatus = false;
            const { viewport } = enabledElement;
            const annotations = getAnnotations(this.getToolName(), viewport.element);
            if (!annotations?.length) {
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
                if (!isAnnotationVisible(annotationUID)) {
                    continue;
                }
                if (!isAnnotationLocked(annotation) &&
                    !this.editData &&
                    activeHandleIndex !== null &&
                    firstOrLastSlice) {
                    activeHandleCanvasCoords = [canvasCoordinates[activeHandleIndex]];
                }
                if (activeHandleCanvasCoords) {
                    const handleGroupUID = '0';
                    drawHandlesSvg(svgDrawingHelper, annotationUID, handleGroupUID, activeHandleCanvasCoords, {
                        color,
                    });
                }
                let lineDashToUse = lineDash;
                if (!firstOrLastSlice) {
                    lineDashToUse = 2;
                }
                const rectangleUID = '0';
                drawRectSvg(svgDrawingHelper, annotationUID, rectangleUID, canvasCoordinates[0], canvasCoordinates[3], {
                    color,
                    lineDash: lineDashToUse,
                    lineWidth,
                });
                renderStatus = true;
            }
            return renderStatus;
        };
        this._throttledCalculateCachedStats = throttle(this._calculateCachedStatsTool, 100, { trailing: true });
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
        const endIJK = vec3.fromValues(startIJK[0], startIJK[1], endSlice);
        const startWorld = vec3.create();
        imageData.indexToWorldVec3(startIJK, startWorld);
        const endWorld = vec3.create();
        imageData.indexToWorldVec3(endIJK, endWorld);
        const distance = vec3.distance(startWorld, endWorld);
        const newProjectionPoints = [];
        for (let dist = 0; dist < distance; dist += spacingInNormal) {
            newProjectionPoints.push(points.map((point) => {
                const newPoint = vec3.create();
                vec3.scaleAndAdd(newPoint, point, viewPlaneNormal, dist);
                return Array.from(newPoint);
            }));
        }
        data.cachedStats.projectionPoints = newProjectionPoints;
        const projectionPointsImageIds = [];
        for (const RectanglePoints of newProjectionPoints) {
            const imageId = csUtils.getClosestImageId(imageVolume, RectanglePoints[0], viewPlaneNormal);
            projectionPointsImageIds.push(imageId);
        }
        data.cachedStats.projectionPointsImageIds = projectionPointsImageIds;
    }
    _calculateCachedStatsTool(annotation, enabledElement) {
        const data = annotation.data;
        const { viewportId, renderingEngineId, viewport } = enabledElement;
        const { cachedStats } = data;
        const volumeId = this.getTargetId(viewport);
        const imageVolume = cache.getVolume(volumeId.split('volumeId:')[1]);
        this._computeProjectionPoints(annotation, imageVolume);
        annotation.invalidated = false;
        const eventType = Events.ANNOTATION_MODIFIED;
        const eventDetail = {
            annotation,
            viewportId,
            renderingEngineId,
        };
        triggerEvent(eventTarget, eventType, eventDetail);
        return cachedStats;
    }
    _getEndSliceIndex(imageVolume, worldPos, spacingInNormal, viewPlaneNormal) {
        const numSlicesToPropagate = this.configuration.numSlicesToPropagate;
        const endPos = vec3.create();
        vec3.scaleAndAdd(endPos, worldPos, viewPlaneNormal, numSlicesToPropagate * spacingInNormal);
        const halfSpacingInNormalDirection = spacingInNormal / 2;
        const { imageIds } = imageVolume;
        let imageIdIndex;
        for (let i = 0; i < imageIds.length; i++) {
            const imageId = imageIds[i];
            const { imagePositionPatient } = metaData.get('imagePlaneModule', imageId);
            const dir = vec3.create();
            vec3.sub(dir, endPos, imagePositionPatient);
            const dot = vec3.dot(dir, viewPlaneNormal);
            if (Math.abs(dot) < halfSpacingInNormalDirection) {
                imageIdIndex = i;
            }
        }
        return imageIdIndex;
    }
}
RectangleROIStartEndThresholdTool.toolName = 'RectangleROIStartEndThreshold';
export default RectangleROIStartEndThresholdTool;
//# sourceMappingURL=RectangleROIStartEndThresholdTool.js.map