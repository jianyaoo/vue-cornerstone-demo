"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const gl_matrix_1 = require("gl-matrix");
const sphere_1 = require("./math/sphere");
const pointInShapeCallback_1 = __importDefault(require("./pointInShapeCallback"));
const boundingBox_1 = require("./boundingBox");
const { transformWorldToIndex } = core_1.utilities;
function pointInSurroundingSphereCallback(imageData, circlePoints, callback, viewport) {
    const { boundsIJK, centerWorld, radiusWorld } = _getBounds(circlePoints, imageData, viewport);
    const sphereObj = {
        center: centerWorld,
        radius: radiusWorld,
    };
    (0, pointInShapeCallback_1.default)(imageData, (pointLPS) => (0, sphere_1.pointInSphere)(sphereObj, pointLPS), callback, boundsIJK);
}
exports.default = pointInSurroundingSphereCallback;
function _getBounds(circlePoints, imageData, viewport) {
    const [bottom, top] = circlePoints;
    const centerWorld = gl_matrix_1.vec3.fromValues((bottom[0] + top[0]) / 2, (bottom[1] + top[1]) / 2, (bottom[2] + top[2]) / 2);
    const radiusWorld = gl_matrix_1.vec3.distance(bottom, top) / 2;
    let boundsIJK;
    if (!viewport) {
        const centerIJK = transformWorldToIndex(imageData, centerWorld);
        const spacings = imageData.getSpacing();
        const minSpacing = Math.min(...spacings);
        const maxRadiusIJK = Math.ceil(radiusWorld / minSpacing);
        boundsIJK = [
            [centerIJK[0] - maxRadiusIJK, centerIJK[0] + maxRadiusIJK],
            [centerIJK[1] - maxRadiusIJK, centerIJK[1] + maxRadiusIJK],
            [centerIJK[2] - maxRadiusIJK, centerIJK[2] + maxRadiusIJK],
        ];
        return {
            boundsIJK,
            centerWorld: centerWorld,
            radiusWorld,
        };
    }
    boundsIJK = _computeBoundsIJKWithCamera(imageData, viewport, circlePoints, centerWorld, radiusWorld);
    return {
        boundsIJK,
        centerWorld: centerWorld,
        radiusWorld,
    };
}
function _computeBoundsIJKWithCamera(imageData, viewport, circlePoints, centerWorld, radiusWorld) {
    const [bottom, top] = circlePoints;
    const dimensions = imageData.getDimensions();
    const camera = viewport.getCamera();
    const viewUp = gl_matrix_1.vec3.fromValues(camera.viewUp[0], camera.viewUp[1], camera.viewUp[2]);
    const viewPlaneNormal = gl_matrix_1.vec3.fromValues(camera.viewPlaneNormal[0], camera.viewPlaneNormal[1], camera.viewPlaneNormal[2]);
    const viewRight = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.cross(viewRight, viewUp, viewPlaneNormal);
    const topLeftWorld = gl_matrix_1.vec3.create();
    const bottomRightWorld = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.scaleAndAdd(topLeftWorld, top, viewPlaneNormal, radiusWorld);
    gl_matrix_1.vec3.scaleAndAdd(bottomRightWorld, bottom, viewPlaneNormal, -radiusWorld);
    gl_matrix_1.vec3.scaleAndAdd(topLeftWorld, topLeftWorld, viewRight, -radiusWorld);
    gl_matrix_1.vec3.scaleAndAdd(bottomRightWorld, bottomRightWorld, viewRight, radiusWorld);
    const sphereCornersIJK = [
        transformWorldToIndex(imageData, topLeftWorld),
        (transformWorldToIndex(imageData, bottomRightWorld)),
    ];
    const boundsIJK = (0, boundingBox_1.getBoundingBoxAroundShape)(sphereCornersIJK, dimensions);
    return boundsIJK;
}
//# sourceMappingURL=pointInSurroundingSphereCallback.js.map