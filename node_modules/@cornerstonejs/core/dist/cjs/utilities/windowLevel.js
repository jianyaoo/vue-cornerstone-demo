"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLowHighRange = exports.toWindowLevel = void 0;
function toWindowLevel(low, high) {
    const windowWidth = Math.abs(high - low) + 1;
    const windowCenter = (low + high + 1) / 2;
    return { windowWidth, windowCenter };
}
exports.toWindowLevel = toWindowLevel;
function toLowHighRange(windowWidth, windowCenter) {
    const lower = windowCenter - 0.5 - (windowWidth - 1) / 2;
    const upper = windowCenter - 0.5 + (windowWidth - 1) / 2;
    return { lower, upper };
}
exports.toLowHighRange = toLowHighRange;
//# sourceMappingURL=windowLevel.js.map