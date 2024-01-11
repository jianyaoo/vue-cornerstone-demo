"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = exports.default = void 0;
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
exports.default = clamp;
exports.clamp = clamp;
//# sourceMappingURL=clamp.js.map