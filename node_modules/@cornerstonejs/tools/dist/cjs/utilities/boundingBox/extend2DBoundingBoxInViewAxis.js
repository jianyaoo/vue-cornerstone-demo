"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extend2DBoundingBoxInViewAxis(boundsIJK, numSlicesToProject) {
    const sliceNormalIndex = boundsIJK.findIndex(([min, max]) => min === max);
    if (sliceNormalIndex === -1) {
        throw new Error('3D bounding boxes not supported in an oblique plane');
    }
    boundsIJK[sliceNormalIndex][0] -= numSlicesToProject;
    boundsIJK[sliceNormalIndex][1] += numSlicesToProject;
    return boundsIJK;
}
exports.default = extend2DBoundingBoxInViewAxis;
//# sourceMappingURL=extend2DBoundingBoxInViewAxis.js.map