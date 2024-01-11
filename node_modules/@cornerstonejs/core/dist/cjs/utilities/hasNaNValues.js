"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasNaNValues(input) {
    if (Array.isArray(input)) {
        return input.some((value) => Number.isNaN(value));
    }
    return Number.isNaN(input);
}
exports.default = hasNaNValues;
//# sourceMappingURL=hasNaNValues.js.map