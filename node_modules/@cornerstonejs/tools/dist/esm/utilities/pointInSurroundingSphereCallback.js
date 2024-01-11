import { utilities as csUtils } from '@cornerstonejs/core';
import { vec3 } from 'gl-matrix';
import { pointInSphere } from './math/sphere';
import pointInShapeCallback from './pointInShapeCallback';
import { getBoundingBoxAroundShape } from './boundingBox';
const { transformWorldToIndex } = csUtils;
export default function pointInSurroundingSphereCallback(imageData, circlePoints, callback, viewport) {
    const { boundsIJK, centerWorld, radiusWorld } = _getBounds(circlePoints, imageData, viewport);
    const sphereObj = {
        center: centerWorld,
        radius: radiusWorld,
    };
    pointInShapeCallback(imageData, (pointLPS) => pointInSphere(sphereObj, pointLPS), callback, boundsIJK);
}
function _getBounds(circlePoints, imageData, viewport) {
    const [bottom, top] = circlePoints;
    const centerWorld = vec3.fromValues((bottom[0] + top[0]) / 2, (bottom[1] + top[1]) / 2, (bottom[2] + top[2]) / 2);
    const radiusWorld = vec3.distance(bottom, top) / 2;
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
    const viewUp = vec3.fromValues(camera.viewUp[0], camera.viewUp[1], camera.viewUp[2]);
    const viewPlaneNormal = vec3.fromValues(camera.viewPlaneNormal[0], camera.viewPlaneNormal[1], camera.viewPlaneNormal[2]);
    const viewRight = vec3.create();
    vec3.cross(viewRight, viewUp, viewPlaneNormal);
    const topLeftWorld = vec3.create();
    const bottomRightWorld = vec3.create();
    vec3.scaleAndAdd(topLeftWorld, top, viewPlaneNormal, radiusWorld);
    vec3.scaleAndAdd(bottomRightWorld, bottom, viewPlaneNormal, -radiusWorld);
    vec3.scaleAndAdd(topLeftWorld, topLeftWorld, viewRight, -radiusWorld);
    vec3.scaleAndAdd(bottomRightWorld, bottomRightWorld, viewRight, radiusWorld);
    const sphereCornersIJK = [
        transformWorldToIndex(imageData, topLeftWorld),
        (transformWorldToIndex(imageData, bottomRightWorld)),
    ];
    const boundsIJK = getBoundingBoxAroundShape(sphereCornersIJK, dimensions);
    return boundsIJK;
}
//# sourceMappingURL=pointInSurroundingSphereCallback.js.map