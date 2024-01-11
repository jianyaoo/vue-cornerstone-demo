"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const gl_matrix_1 = require("gl-matrix");
const base_1 = require("./base");
const angleBetweenLines_1 = __importDefault(require("../utilities/math/angle/angleBetweenLines"));
class PlanarRotateTool extends base_1.BaseTool {
    constructor(toolProps = {}, defaultToolProps = {
        supportedInteractionTypes: ['Mouse', 'Touch'],
    }) {
        super(toolProps, defaultToolProps);
        this.touchDragCallback = this._dragCallback.bind(this);
        this.mouseDragCallback = this._dragCallback.bind(this);
    }
    _dragCallback(evt) {
        const { element, currentPoints, startPoints } = evt.detail;
        const currentPointWorld = currentPoints.world;
        const startPointWorld = startPoints.world;
        const enabledElement = (0, core_1.getEnabledElement)(element);
        const { viewport } = enabledElement;
        const camera = viewport.getCamera();
        const width = element.clientWidth;
        const height = element.clientHeight;
        const centerCanvas = [width * 0.5, height * 0.5];
        const centerWorld = viewport.canvasToWorld(centerCanvas);
        let angle = (0, angleBetweenLines_1.default)([startPointWorld, centerWorld], [centerWorld, currentPointWorld]);
        const { viewPlaneNormal, viewUp } = camera;
        const v1 = gl_matrix_1.vec3.sub(gl_matrix_1.vec3.create(), centerWorld, startPointWorld);
        const v2 = gl_matrix_1.vec3.sub(gl_matrix_1.vec3.create(), centerWorld, currentPointWorld);
        const cross = gl_matrix_1.vec3.cross(gl_matrix_1.vec3.create(), v1, v2);
        if (gl_matrix_1.vec3.dot(viewPlaneNormal, cross) > 0) {
            angle = -angle;
        }
        if (Number.isNaN(angle)) {
            return;
        }
        if (viewport instanceof core_1.BaseVolumeViewport) {
            const rotAngle = (angle * Math.PI) / 180;
            const rotMat = gl_matrix_1.mat4.identity(new Float32Array(16));
            gl_matrix_1.mat4.rotate(rotMat, rotMat, rotAngle, viewPlaneNormal);
            const rotatedViewUp = gl_matrix_1.vec3.transformMat4(gl_matrix_1.vec3.create(), viewUp, rotMat);
            viewport.setCamera({ viewUp: rotatedViewUp });
        }
        else {
            const { rotation } = viewport.getProperties();
            viewport.setProperties({ rotation: rotation + angle });
        }
        viewport.render();
    }
}
PlanarRotateTool.toolName = 'PlanarRotate';
exports.default = PlanarRotateTool;
//# sourceMappingURL=PlanarRotateTool.js.map