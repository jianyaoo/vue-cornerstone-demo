"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
function getWorldWidthAndHeightFromTwoPoints(viewPlaneNormal, viewUp, worldPos1, worldPos2) {
    const viewRight = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.cross(viewRight, viewUp, viewPlaneNormal);
    const pos1 = gl_matrix_1.vec3.fromValues(...worldPos1);
    const pos2 = gl_matrix_1.vec3.fromValues(...worldPos2);
    const diagonal = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.subtract(diagonal, pos1, pos2);
    const diagonalLength = gl_matrix_1.vec3.length(diagonal);
    if (diagonalLength < 0.0001) {
        return { worldWidth: 0, worldHeight: 0 };
    }
    const cosTheta = gl_matrix_1.vec3.dot(diagonal, viewRight) / (diagonalLength * gl_matrix_1.vec3.length(viewRight));
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const worldWidth = sinTheta * diagonalLength;
    const worldHeight = cosTheta * diagonalLength;
    return { worldWidth, worldHeight };
}
exports.default = getWorldWidthAndHeightFromTwoPoints;
//# sourceMappingURL=getWorldWidthAndHeightFromTwoPoints.js.map