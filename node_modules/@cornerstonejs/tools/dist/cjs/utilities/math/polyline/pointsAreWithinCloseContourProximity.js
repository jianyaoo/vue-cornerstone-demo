"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const pointsAreWithinCloseContourProximity = (p1, p2, closeContourProximity) => {
    return gl_matrix_1.vec2.dist(p1, p2) < closeContourProximity;
};
exports.default = pointsAreWithinCloseContourProximity;
//# sourceMappingURL=pointsAreWithinCloseContourProximity.js.map