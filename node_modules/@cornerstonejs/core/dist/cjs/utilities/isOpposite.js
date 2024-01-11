"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isOpposite(v1, v2, tolerance = 1e-5) {
    return (Math.abs(v1[0] + v2[0]) < tolerance &&
        Math.abs(v1[1] + v2[1]) < tolerance &&
        Math.abs(v1[2] + v2[2]) < tolerance);
}
exports.default = isOpposite;
//# sourceMappingURL=isOpposite.js.map