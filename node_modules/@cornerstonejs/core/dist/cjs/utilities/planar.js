"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planeDistanceToPoint = exports.threePlaneIntersection = exports.planeEquation = exports.linePlaneIntersection = void 0;
const gl_matrix_1 = require("gl-matrix");
function linePlaneIntersection(p0, p1, plane) {
    const [x0, y0, z0] = p0;
    const [x1, y1, z1] = p1;
    const [A, B, C, D] = plane;
    const a = x1 - x0;
    const b = y1 - y0;
    const c = z1 - z0;
    const t = (-1 * (A * x0 + B * y0 + C * z0 - D)) / (A * a + B * b + C * c);
    const X = a * t + x0;
    const Y = b * t + y0;
    const Z = c * t + z0;
    return [X, Y, Z];
}
exports.linePlaneIntersection = linePlaneIntersection;
function planeEquation(normal, point, normalized = false) {
    const [A, B, C] = normal;
    const D = A * point[0] + B * point[1] + C * point[2];
    if (normalized) {
        const length = Math.sqrt(A * A + B * B + C * C);
        return [A / length, B / length, C / length, D / length];
    }
    return [A, B, C, D];
}
exports.planeEquation = planeEquation;
function threePlaneIntersection(firstPlane, secondPlane, thirdPlane) {
    const [A1, B1, C1, D1] = firstPlane;
    const [A2, B2, C2, D2] = secondPlane;
    const [A3, B3, C3, D3] = thirdPlane;
    const m0 = gl_matrix_1.mat3.fromValues(A1, A2, A3, B1, B2, B3, C1, C2, C3);
    const m1 = gl_matrix_1.mat3.fromValues(D1, D2, D3, B1, B2, B3, C1, C2, C3);
    const m2 = gl_matrix_1.mat3.fromValues(A1, A2, A3, D1, D2, D3, C1, C2, C3);
    const m3 = gl_matrix_1.mat3.fromValues(A1, A2, A3, B1, B2, B3, D1, D2, D3);
    const x = gl_matrix_1.mat3.determinant(m1) / gl_matrix_1.mat3.determinant(m0);
    const y = gl_matrix_1.mat3.determinant(m2) / gl_matrix_1.mat3.determinant(m0);
    const z = gl_matrix_1.mat3.determinant(m3) / gl_matrix_1.mat3.determinant(m0);
    return [x, y, z];
}
exports.threePlaneIntersection = threePlaneIntersection;
function planeDistanceToPoint(plane, point, signed = false) {
    const [A, B, C, D] = plane;
    const [x, y, z] = point;
    const numerator = A * x + B * y + C * z - D;
    const distance = Math.abs(numerator) / Math.sqrt(A * A + B * B + C * C);
    const sign = signed ? Math.sign(numerator) : 1;
    return sign * distance;
}
exports.planeDistanceToPoint = planeDistanceToPoint;
//# sourceMappingURL=planar.js.map