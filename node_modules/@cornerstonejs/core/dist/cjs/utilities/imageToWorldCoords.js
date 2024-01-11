"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const __1 = require("..");
function imageToWorldCoords(imageId, imageCoords) {
    const imagePlaneModule = __1.metaData.get('imagePlaneModule', imageId);
    if (!imagePlaneModule) {
        throw new Error(`No imagePlaneModule found for imageId: ${imageId}`);
    }
    const { columnCosines, rowCosines, imagePositionPatient: origin, } = imagePlaneModule;
    let { columnPixelSpacing, rowPixelSpacing } = imagePlaneModule;
    columnPixelSpacing || (columnPixelSpacing = 1);
    rowPixelSpacing || (rowPixelSpacing = 1);
    const imageCoordsInWorld = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.scaleAndAdd(imageCoordsInWorld, origin, rowCosines, rowPixelSpacing * (imageCoords[0] - 0.5));
    gl_matrix_1.vec3.scaleAndAdd(imageCoordsInWorld, imageCoordsInWorld, columnCosines, columnPixelSpacing * (imageCoords[1] - 0.5));
    return Array.from(imageCoordsInWorld);
}
exports.default = imageToWorldCoords;
//# sourceMappingURL=imageToWorldCoords.js.map