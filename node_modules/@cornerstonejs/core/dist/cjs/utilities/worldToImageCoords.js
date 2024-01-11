"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const __1 = require("..");
function worldToImageCoords(imageId, worldCoords) {
    const imagePlaneModule = __1.metaData.get('imagePlaneModule', imageId);
    if (!imagePlaneModule) {
        throw new Error(`No imagePlaneModule found for imageId: ${imageId}`);
    }
    const { columnCosines, rowCosines, imagePositionPatient: origin, } = imagePlaneModule;
    let { columnPixelSpacing, rowPixelSpacing } = imagePlaneModule;
    columnPixelSpacing || (columnPixelSpacing = 1);
    rowPixelSpacing || (rowPixelSpacing = 1);
    const newOrigin = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.scaleAndAdd(newOrigin, origin, columnCosines, -columnPixelSpacing / 2);
    gl_matrix_1.vec3.scaleAndAdd(newOrigin, newOrigin, rowCosines, -rowPixelSpacing / 2);
    const sub = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.sub(sub, worldCoords, newOrigin);
    const rowDistance = gl_matrix_1.vec3.dot(sub, rowCosines);
    const columnDistance = gl_matrix_1.vec3.dot(sub, columnCosines);
    const imageCoords = [
        rowDistance / rowPixelSpacing,
        columnDistance / columnPixelSpacing,
    ];
    return imageCoords;
}
exports.default = worldToImageCoords;
//# sourceMappingURL=worldToImageCoords.js.map