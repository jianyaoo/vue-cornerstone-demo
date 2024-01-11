"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpolateVec3 = exports.default = void 0;
const interpolateVec3 = (a, b, t) => {
    return [
        a[0] * (1 - t) + b[0] * t,
        a[1] * (1 - t) + b[1] * t,
        a[2] * (1 - t) + b[2] * t,
    ];
};
exports.default = interpolateVec3;
exports.interpolateVec3 = interpolateVec3;
//# sourceMappingURL=interpolateVec3.js.map