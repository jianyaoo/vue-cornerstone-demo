"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clipToBox = exports.clip = void 0;
function clip(val, low, high) {
    return Math.min(Math.max(low, val), high);
}
exports.clip = clip;
function clipToBox(point, box) {
    point.x = clip(point.x, 0, box.width);
    point.y = clip(point.y, 0, box.height);
}
exports.clipToBox = clipToBox;
exports.default = clip;
//# sourceMappingURL=clip.js.map