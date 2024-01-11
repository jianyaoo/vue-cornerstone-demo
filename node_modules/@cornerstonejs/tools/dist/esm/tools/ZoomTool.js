import { vec3 } from 'gl-matrix';
import vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { getEnabledElement } from '@cornerstonejs/core';
import { BaseTool } from './base';
class ZoomTool extends BaseTool {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            zoomToCenter: false,
            minZoomScale: 0.1,
            maxZoomScale: 30,
            pinchToZoom: true,
            pan: true,
            invert: false,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.preMouseDownCallback = (evt) => {
            const eventData = evt.detail;
            const { element, currentPoints } = eventData;
            const worldPos = currentPoints.world;
            const enabledElement = getEnabledElement(element);
            const camera = enabledElement.viewport.getCamera();
            const { focalPoint } = camera;
            this.initialMousePosWorld = worldPos;
            let dirVec = vec3.fromValues(focalPoint[0] - worldPos[0], focalPoint[1] - worldPos[1], focalPoint[2] - worldPos[2]);
            dirVec = vec3.normalize(vec3.create(), dirVec);
            this.dirVec = dirVec;
            return false;
        };
        this.preTouchStartCallback = (evt) => {
            if (!this.configuration.pinchToZoom) {
                return this.preMouseDownCallback(evt);
            }
        };
        this._dragParallelProjection = (evt, viewport, camera, pinch = false) => {
            const { element, deltaPoints } = evt.detail;
            const deltaY = pinch
                ? evt.detail.deltaDistance.canvas
                : deltaPoints.canvas[1];
            const size = [element.clientWidth, element.clientHeight];
            const { parallelScale, focalPoint, position } = camera;
            const zoomScale = 5 / size[1];
            const k = deltaY * zoomScale * (this.configuration.invert ? -1 : 1);
            const parallelScaleToSet = (1.0 - k) * parallelScale;
            let focalPointToSet = focalPoint;
            let positionToSet = position;
            if (!this.configuration.zoomToCenter) {
                const distanceToCanvasCenter = vec3.distance(focalPoint, this.initialMousePosWorld);
                positionToSet = vec3.scaleAndAdd(vec3.create(), position, this.dirVec, -distanceToCanvasCenter * k);
                focalPointToSet = vec3.scaleAndAdd(vec3.create(), focalPoint, this.dirVec, -distanceToCanvasCenter * k);
            }
            const imageData = viewport.getImageData();
            let spacing = [1, 1, 1];
            if (imageData) {
                spacing = imageData.spacing;
            }
            const { minZoomScale, maxZoomScale } = this.configuration;
            const t = element.clientHeight * spacing[1] * 0.5;
            const scale = t / parallelScaleToSet;
            let cappedParallelScale = parallelScaleToSet;
            let thresholdExceeded = false;
            if (imageData) {
                if (scale < minZoomScale) {
                    cappedParallelScale = t / minZoomScale;
                    thresholdExceeded = true;
                }
                else if (scale >= maxZoomScale) {
                    cappedParallelScale = t / maxZoomScale;
                    thresholdExceeded = true;
                }
            }
            viewport.setCamera({
                parallelScale: cappedParallelScale,
                focalPoint: thresholdExceeded ? focalPoint : focalPointToSet,
                position: thresholdExceeded ? position : positionToSet,
            });
        };
        this._dragPerspectiveProjection = (evt, viewport, camera, pinch = false) => {
            const { element, deltaPoints } = evt.detail;
            const deltaY = pinch
                ? evt.detail.deltaDistance.canvas
                : deltaPoints.canvas[1];
            const size = [element.clientWidth, element.clientHeight];
            const { position, focalPoint, viewPlaneNormal } = camera;
            const distance = vtkMath.distance2BetweenPoints(position, focalPoint);
            const zoomScale = Math.sqrt(distance) / size[1];
            const directionOfProjection = [
                -viewPlaneNormal[0],
                -viewPlaneNormal[1],
                -viewPlaneNormal[2],
            ];
            const k = this.configuration.invert
                ? deltaY / zoomScale
                : deltaY * zoomScale;
            let tmp = k * directionOfProjection[0];
            position[0] += tmp;
            focalPoint[0] += tmp;
            tmp = k * directionOfProjection[1];
            position[1] += tmp;
            focalPoint[1] += tmp;
            tmp = k * directionOfProjection[2];
            position[2] += tmp;
            focalPoint[2] += tmp;
            viewport.setCamera({ position, focalPoint });
        };
        this.initialMousePosWorld = [0, 0, 0];
        this.dirVec = [0, 0, 0];
        if (this.configuration.pinchToZoom) {
            this.touchDragCallback = this._pinchCallback.bind(this);
        }
        else {
            this.touchDragCallback = this._dragCallback.bind(this);
        }
        this.mouseDragCallback = this._dragCallback.bind(this);
    }
    _pinchCallback(evt) {
        const pointsList = evt.detail
            .currentPointsList;
        if (pointsList.length > 1) {
            const { element, currentPoints } = evt.detail;
            const enabledElement = getEnabledElement(element);
            const { viewport } = enabledElement;
            const camera = viewport.getCamera();
            const worldPos = currentPoints.world;
            const { focalPoint } = camera;
            this.initialMousePosWorld = worldPos;
            let dirVec = vec3.fromValues(focalPoint[0] - worldPos[0], focalPoint[1] - worldPos[1], focalPoint[2] - worldPos[2]);
            dirVec = vec3.normalize(vec3.create(), dirVec);
            this.dirVec = dirVec;
            if (camera.parallelProjection) {
                this._dragParallelProjection(evt, viewport, camera, true);
            }
            else {
                this._dragPerspectiveProjection(evt, viewport, camera, true);
            }
            viewport.render();
        }
        if (this.configuration.pan) {
            this._panCallback(evt);
        }
    }
    _dragCallback(evt) {
        const { element } = evt.detail;
        const enabledElement = getEnabledElement(element);
        const { viewport } = enabledElement;
        const camera = viewport.getCamera();
        if (camera.parallelProjection) {
            this._dragParallelProjection(evt, viewport, camera);
        }
        else {
            this._dragPerspectiveProjection(evt, viewport, camera);
        }
        viewport.render();
    }
    _panCallback(evt) {
        const { element, deltaPoints } = evt.detail;
        const enabledElement = getEnabledElement(element);
        const deltaPointsWorld = deltaPoints.world;
        const camera = enabledElement.viewport.getCamera();
        const { focalPoint, position } = camera;
        const updatedPosition = [
            position[0] - deltaPointsWorld[0],
            position[1] - deltaPointsWorld[1],
            position[2] - deltaPointsWorld[2],
        ];
        const updatedFocalPoint = [
            focalPoint[0] - deltaPointsWorld[0],
            focalPoint[1] - deltaPointsWorld[1],
            focalPoint[2] - deltaPointsWorld[2],
        ];
        enabledElement.viewport.setCamera({
            focalPoint: updatedFocalPoint,
            position: updatedPosition,
        });
        enabledElement.viewport.render();
    }
}
ZoomTool.toolName = 'Zoom';
export default ZoomTool;
//# sourceMappingURL=ZoomTool.js.map