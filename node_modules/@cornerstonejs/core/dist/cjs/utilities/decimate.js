"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function decimate(list, interleave, offset = 0) {
    const interleaveIndices = [];
    for (let i = offset; i < list.length; i += interleave) {
        interleaveIndices.push(i);
    }
    return interleaveIndices;
}
exports.default = decimate;
//# sourceMappingURL=decimate.js.map