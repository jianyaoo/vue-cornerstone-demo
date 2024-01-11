"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.midPoint2 = void 0;
const midPoint = (...args) => {
    const ret = args[0].length === 2 ? [0, 0] : [0, 0, 0];
    const len = args.length;
    for (const arg of args) {
        ret[0] += arg[0] / len;
        ret[1] += arg[1] / len;
        if (ret.length === 3) {
            ret[2] += arg[2] / len;
        }
    }
    return ret;
};
const midPoint2 = midPoint;
exports.midPoint2 = midPoint2;
exports.default = midPoint;
//# sourceMappingURL=midPoint.js.map