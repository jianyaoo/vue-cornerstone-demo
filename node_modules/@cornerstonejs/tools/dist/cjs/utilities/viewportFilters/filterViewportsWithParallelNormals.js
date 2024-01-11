"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterViewportsWithParallelNormals = void 0;
const gl_matrix_1 = require("gl-matrix");
function filterViewportsWithParallelNormals(viewports, camera, EPS = 0.999) {
    return viewports.filter((viewport) => {
        const vpCamera = viewport.getCamera();
        const isParallel = Math.abs(gl_matrix_1.vec3.dot(vpCamera.viewPlaneNormal, camera.viewPlaneNormal)) >
            EPS;
        return isParallel;
    });
}
exports.filterViewportsWithParallelNormals = filterViewportsWithParallelNormals;
exports.default = filterViewportsWithParallelNormals;
//# sourceMappingURL=filterViewportsWithParallelNormals.js.map