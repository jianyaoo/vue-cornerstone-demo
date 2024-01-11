"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRangeValid = exports.default = void 0;
const isRangeValid = (range) => {
    return range && range.upper > range.lower;
};
exports.default = isRangeValid;
exports.isRangeValid = isRangeValid;
//# sourceMappingURL=isRangeValid.js.map