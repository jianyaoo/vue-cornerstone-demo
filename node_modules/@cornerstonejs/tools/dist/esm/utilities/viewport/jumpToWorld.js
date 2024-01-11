import { VolumeViewport } from '@cornerstonejs/core';
import { vec3 } from 'gl-matrix';
export default function jumpToWorld(viewport, jumpWorld) {
    if (!(viewport instanceof VolumeViewport)) {
        return;
    }
    const { focalPoint } = viewport.getCamera();
    const delta = [0, 0, 0];
    vec3.sub(delta, jumpWorld, focalPoint);
    _applyShift(viewport, delta);
    return true;
}
function _applyShift(viewport, delta) {
    const camera = viewport.getCamera();
    const normal = camera.viewPlaneNormal;
    const dotProd = vec3.dot(delta, normal);
    const projectedDelta = vec3.fromValues(normal[0], normal[1], normal[2]);
    vec3.scale(projectedDelta, projectedDelta, dotProd);
    if (Math.abs(projectedDelta[0]) > 1e-3 ||
        Math.abs(projectedDelta[1]) > 1e-3 ||
        Math.abs(projectedDelta[2]) > 1e-3) {
        const newFocalPoint = [0, 0, 0];
        const newPosition = [0, 0, 0];
        vec3.add(newFocalPoint, camera.focalPoint, projectedDelta);
        vec3.add(newPosition, camera.position, projectedDelta);
        viewport.setCamera({
            focalPoint: newFocalPoint,
            position: newPosition,
        });
        viewport.render();
    }
}
//# sourceMappingURL=jumpToWorld.js.map