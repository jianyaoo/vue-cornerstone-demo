"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const spatialRegistrationMetadataProvider_1 = __importDefault(require("./spatialRegistrationMetadataProvider"));
const __1 = require("..");
const ALLOWED_DELTA = 0.05;
function calculateViewportsSpatialRegistration(viewport1, viewport2) {
    const imageId1 = viewport1.getCurrentImageId();
    const imageId2 = viewport2.getCurrentImageId();
    const imagePlaneModule1 = __1.metaData.get('imagePlaneModule', imageId1);
    const imagePlaneModule2 = __1.metaData.get('imagePlaneModule', imageId2);
    if (!imagePlaneModule1 || !imagePlaneModule2) {
        console.log('Viewport spatial registration requires image plane module');
        return;
    }
    const { imageOrientationPatient: iop2 } = imagePlaneModule2;
    const isSameImagePlane = imagePlaneModule1.imageOrientationPatient.every((v, i) => Math.abs(v - iop2[i]) < ALLOWED_DELTA);
    if (!isSameImagePlane) {
        console.log('Viewport spatial registration only supported for same orientation (hence translation only) for now', imagePlaneModule1 === null || imagePlaneModule1 === void 0 ? void 0 : imagePlaneModule1.imageOrientationPatient, imagePlaneModule2 === null || imagePlaneModule2 === void 0 ? void 0 : imagePlaneModule2.imageOrientationPatient);
        return;
    }
    const imagePositionPatient1 = imagePlaneModule1.imagePositionPatient;
    const imagePositionPatient2 = imagePlaneModule2.imagePositionPatient;
    const translation = gl_matrix_1.vec3.subtract(gl_matrix_1.vec3.create(), imagePositionPatient1, imagePositionPatient2);
    const mat = gl_matrix_1.mat4.fromTranslation(gl_matrix_1.mat4.create(), translation);
    spatialRegistrationMetadataProvider_1.default.add([viewport1.id, viewport2.id], mat);
}
exports.default = calculateViewportsSpatialRegistration;
//# sourceMappingURL=calculateViewportsSpatialRegistration.js.map