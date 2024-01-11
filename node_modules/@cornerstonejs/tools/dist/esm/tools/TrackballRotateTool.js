import vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { getEnabledElement } from '@cornerstonejs/core';
import { mat4, vec3 } from 'gl-matrix';
import { BaseTool } from './base';
class TrackballRotateTool extends BaseTool {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
        configuration: {
            rotateIncrementDegrees: 2,
        },
    }) {
        super(toolProps, defaultToolProps);
        this.rotateCamera = (viewport, centerWorld, axis, angle) => {
            const vtkCamera = viewport.getVtkActiveCamera();
            const viewUp = vtkCamera.getViewUp();
            const focalPoint = vtkCamera.getFocalPoint();
            const position = vtkCamera.getPosition();
            const newPosition = [0, 0, 0];
            const newFocalPoint = [0, 0, 0];
            const newViewUp = [0, 0, 0];
            const transform = mat4.identity(new Float32Array(16));
            mat4.translate(transform, transform, centerWorld);
            mat4.rotate(transform, transform, angle, axis);
            mat4.translate(transform, transform, [
                -centerWorld[0],
                -centerWorld[1],
                -centerWorld[2],
            ]);
            vec3.transformMat4(newPosition, position, transform);
            vec3.transformMat4(newFocalPoint, focalPoint, transform);
            mat4.identity(transform);
            mat4.rotate(transform, transform, angle, axis);
            vec3.transformMat4(newViewUp, viewUp, transform);
            viewport.setCamera({
                position: newPosition,
                viewUp: newViewUp,
                focalPoint: newFocalPoint,
            });
        };
        this.touchDragCallback = this._dragCallback.bind(this);
        this.mouseDragCallback = this._dragCallback.bind(this);
    }
    _dragCallback(evt) {
        const { element, currentPoints, lastPoints } = evt.detail;
        const currentPointsCanvas = currentPoints.canvas;
        const lastPointsCanvas = lastPoints.canvas;
        const { rotateIncrementDegrees } = this.configuration;
        const enabledElement = getEnabledElement(element);
        const { viewport } = enabledElement;
        const camera = viewport.getCamera();
        const width = element.clientWidth;
        const height = element.clientHeight;
        const normalizedPosition = [
            currentPointsCanvas[0] / width,
            currentPointsCanvas[1] / height,
        ];
        const normalizedPreviousPosition = [
            lastPointsCanvas[0] / width,
            lastPointsCanvas[1] / height,
        ];
        const center = [width * 0.5, height * 0.5];
        const centerWorld = viewport.canvasToWorld(center);
        const normalizedCenter = [0.5, 0.5];
        const radsq = (1.0 + Math.abs(normalizedCenter[0])) ** 2.0;
        const op = [normalizedPreviousPosition[0], 0, 0];
        const oe = [normalizedPosition[0], 0, 0];
        const opsq = op[0] ** 2;
        const oesq = oe[0] ** 2;
        const lop = opsq > radsq ? 0 : Math.sqrt(radsq - opsq);
        const loe = oesq > radsq ? 0 : Math.sqrt(radsq - oesq);
        const nop = [op[0], 0, lop];
        vtkMath.normalize(nop);
        const noe = [oe[0], 0, loe];
        vtkMath.normalize(noe);
        const dot = vtkMath.dot(nop, noe);
        if (Math.abs(dot) > 0.0001) {
            const angleX = -2 *
                Math.acos(vtkMath.clampValue(dot, -1.0, 1.0)) *
                Math.sign(normalizedPosition[0] - normalizedPreviousPosition[0]) *
                rotateIncrementDegrees;
            const upVec = camera.viewUp;
            const atV = camera.viewPlaneNormal;
            const rightV = [0, 0, 0];
            const forwardV = [0, 0, 0];
            vtkMath.cross(upVec, atV, rightV);
            vtkMath.normalize(rightV);
            vtkMath.cross(atV, rightV, forwardV);
            vtkMath.normalize(forwardV);
            vtkMath.normalize(upVec);
            this.rotateCamera(viewport, centerWorld, forwardV, angleX);
            const angleY = (normalizedPreviousPosition[1] - normalizedPosition[1]) *
                rotateIncrementDegrees;
            this.rotateCamera(viewport, centerWorld, rightV, angleY);
            viewport.render();
        }
    }
}
TrackballRotateTool.toolName = 'TrackballRotate';
export default TrackballRotateTool;
//# sourceMappingURL=TrackballRotateTool.js.map