"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const pointCanProjectOnLine = (p, p1, p2, proximity) => {
    const p1p = [p[0] - p1[0], p[1] - p1[1]];
    const p1p2 = [p2[0] - p1[0], p2[1] - p1[1]];
    const dot = p1p[0] * p1p2[0] + p1p[1] * p1p2[1];
    if (dot < 0) {
        return false;
    }
    const p1p2Mag = Math.sqrt(p1p2[0] * p1p2[0] + p1p2[1] * p1p2[1]);
    if (p1p2Mag === 0) {
        return false;
    }
    const projectionVectorMag = dot / p1p2Mag;
    const p1p2UnitVector = [p1p2[0] / p1p2Mag, p1p2[1] / p1p2Mag];
    const projectionVector = [
        p1p2UnitVector[0] * projectionVectorMag,
        p1p2UnitVector[1] * projectionVectorMag,
    ];
    const projectionPoint = [
        p1[0] + projectionVector[0],
        p1[1] + projectionVector[1],
    ];
    const distance = gl_matrix_1.vec2.distance(p, projectionPoint);
    if (distance > proximity) {
        return false;
    }
    if (gl_matrix_1.vec2.distance(p1, projectionPoint) > gl_matrix_1.vec2.distance(p1, p2)) {
        return false;
    }
    return true;
};
exports.default = pointCanProjectOnLine;
//# sourceMappingURL=pointCanProjectOnLine.js.map