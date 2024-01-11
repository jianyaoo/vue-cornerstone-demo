"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areColorbarSizesEqual = exports.default = void 0;
const areColorbarSizesEqual = (a, b) => {
    return !!a && !!b && a.width === b.width && a.height === b.height;
};
exports.default = areColorbarSizesEqual;
exports.areColorbarSizesEqual = areColorbarSizesEqual;
//# sourceMappingURL=areColorbarSizesEqual.js.map