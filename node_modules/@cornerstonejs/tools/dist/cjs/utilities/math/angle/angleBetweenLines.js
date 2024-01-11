"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
function angleBetween3DLines(line1, line2) {
    const [p1, p2] = line1;
    const [p3, p4] = line2;
    const v1 = gl_matrix_1.vec3.sub(gl_matrix_1.vec3.create(), p2, p1);
    const v2 = gl_matrix_1.vec3.sub(gl_matrix_1.vec3.create(), p3, p4);
    const dot = gl_matrix_1.vec3.dot(v1, v2);
    const v1Length = gl_matrix_1.vec3.length(v1);
    const v2Length = gl_matrix_1.vec3.length(v2);
    const cos = dot / (v1Length * v2Length);
    const radian = Math.acos(cos);
    return (radian * 180) / Math.PI;
}
function angleBetween2DLines(line1, line2) {
    const [p1, p2] = line1;
    const [p3, p4] = line2;
    const v1 = gl_matrix_1.vec2.sub(gl_matrix_1.vec2.create(), p2, p1);
    const v2 = gl_matrix_1.vec2.sub(gl_matrix_1.vec2.create(), p3, p4);
    const dot = gl_matrix_1.vec2.dot(v1, v2);
    const v1Length = gl_matrix_1.vec2.length(v1);
    const v2Length = gl_matrix_1.vec2.length(v2);
    const cos = dot / (v1Length * v2Length);
    return Math.acos(cos) * (180 / Math.PI);
}
function angleBetweenLines(line1, line2) {
    const is3D = line1[0].length === 3;
    return is3D
        ? angleBetween3DLines(line1, line2)
        : angleBetween2DLines(line1, line2);
}
exports.default = angleBetweenLines;
//# sourceMappingURL=angleBetweenLines.js.map