"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
function areViewportsCoplanar(viewport1, viewport2) {
    const { viewPlaneNormal: viewPlaneNormal1 } = viewport1.getCamera();
    const { viewPlaneNormal: viewPlaneNormal2 } = viewport2.getCamera();
    const dotProducts = gl_matrix_1.vec3.dot(viewPlaneNormal1, viewPlaneNormal2);
    return Math.abs(dotProducts) > 0.9;
}
exports.default = areViewportsCoplanar;
//# sourceMappingURL=areViewportsCoplanar%20.js.map