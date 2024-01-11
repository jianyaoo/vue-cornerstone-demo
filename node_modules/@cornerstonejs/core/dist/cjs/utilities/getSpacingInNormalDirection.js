"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
function getSpacingInNormalDirection(imageVolume, viewPlaneNormal) {
    const { direction, spacing } = imageVolume;
    const iVector = direction.slice(0, 3);
    const jVector = direction.slice(3, 6);
    const kVector = direction.slice(6, 9);
    const dotProducts = [
        gl_matrix_1.vec3.dot(iVector, viewPlaneNormal),
        gl_matrix_1.vec3.dot(jVector, viewPlaneNormal),
        gl_matrix_1.vec3.dot(kVector, viewPlaneNormal),
    ];
    const projectedSpacing = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.set(projectedSpacing, dotProducts[0] * spacing[0], dotProducts[1] * spacing[1], dotProducts[2] * spacing[2]);
    const spacingInNormalDirection = gl_matrix_1.vec3.length(projectedSpacing);
    return spacingInNormalDirection;
}
exports.default = getSpacingInNormalDirection;
//# sourceMappingURL=getSpacingInNormalDirection.js.map