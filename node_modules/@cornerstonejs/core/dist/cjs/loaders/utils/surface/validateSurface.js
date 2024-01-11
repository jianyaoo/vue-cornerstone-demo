"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSurface = void 0;
function validateSurface(contourSetData) {
    const { data } = contourSetData;
    if (!data.points || !data.polys) {
        throw new Error('Invalid surface data');
    }
}
exports.validateSurface = validateSurface;
//# sourceMappingURL=validateSurface.js.map