"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areColorbarRangesEqual = exports.default = void 0;
const areColorbarRangesEqual = (a, b) => {
    return !!a && !!b && a.lower === b.lower && a.upper === b.upper;
};
exports.default = areColorbarRangesEqual;
exports.areColorbarRangesEqual = areColorbarRangesEqual;
//# sourceMappingURL=areColorbarRangesEqual.js.map