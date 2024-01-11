"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transformWorldToIndex(imageData, worldPos) {
    const continuousIndex = imageData.worldToIndex(worldPos);
    const index = continuousIndex.map(Math.round);
    return index;
}
exports.default = transformWorldToIndex;
//# sourceMappingURL=transformWorldToIndex.js.map