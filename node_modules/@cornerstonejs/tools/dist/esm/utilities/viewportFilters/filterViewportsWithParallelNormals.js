import { vec3 } from 'gl-matrix';
export function filterViewportsWithParallelNormals(viewports, camera, EPS = 0.999) {
    return viewports.filter((viewport) => {
        const vpCamera = viewport.getCamera();
        const isParallel = Math.abs(vec3.dot(vpCamera.viewPlaneNormal, camera.viewPlaneNormal)) >
            EPS;
        return isParallel;
    });
}
export default filterViewportsWithParallelNormals;
//# sourceMappingURL=filterViewportsWithParallelNormals.js.map