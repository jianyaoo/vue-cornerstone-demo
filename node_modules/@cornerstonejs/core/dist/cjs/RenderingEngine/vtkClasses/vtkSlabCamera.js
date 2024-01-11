"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extend = exports.newInstance = void 0;
const macros_1 = __importDefault(require("@kitware/vtk.js/macros"));
const Camera_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Camera"));
const Math_1 = __importDefault(require("@kitware/vtk.js/Common/Core/Math"));
const gl_matrix_1 = require("gl-matrix");
const DEFAULT_VALUES = {
    isPerformingCoordinateTransformation: false,
};
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    Camera_1.default.extend(publicAPI, model, initialValues);
    macros_1.default.setGet(publicAPI, model, ['isPerformingCoordinateTransformation']);
    vtkSlabCamera(publicAPI, model);
}
exports.extend = extend;
const newInstance = macros_1.default.newInstance(extend, 'vtkSlabCamera');
exports.newInstance = newInstance;
function vtkSlabCamera(publicAPI, model) {
    model.classHierarchy.push('vtkSlabCamera');
    const tmpMatrix = gl_matrix_1.mat4.identity(new Float64Array(16));
    const tmpvec1 = new Float64Array(3);
    publicAPI.getProjectionMatrix = (aspect, nearz, farz) => {
        const result = gl_matrix_1.mat4.create();
        if (model.projectionMatrix) {
            const scale = 1 / model.physicalScale;
            gl_matrix_1.vec3.set(tmpvec1, scale, scale, scale);
            gl_matrix_1.mat4.copy(result, model.projectionMatrix);
            gl_matrix_1.mat4.scale(result, result, tmpvec1);
            gl_matrix_1.mat4.transpose(result, result);
            return result;
        }
        gl_matrix_1.mat4.identity(tmpMatrix);
        let cRange0 = model.clippingRange[0];
        let cRange1 = model.clippingRange[1];
        if (model.isPerformingCoordinateTransformation) {
            cRange0 = model.distance;
            cRange1 = model.distance + 0.1;
        }
        const cWidth = cRange1 - cRange0;
        const cRange = [
            cRange0 + ((nearz + 1) * cWidth) / 2.0,
            cRange0 + ((farz + 1) * cWidth) / 2.0,
        ];
        if (model.parallelProjection) {
            const width = model.parallelScale * aspect;
            const height = model.parallelScale;
            const xmin = (model.windowCenter[0] - 1.0) * width;
            const xmax = (model.windowCenter[0] + 1.0) * width;
            const ymin = (model.windowCenter[1] - 1.0) * height;
            const ymax = (model.windowCenter[1] + 1.0) * height;
            gl_matrix_1.mat4.ortho(tmpMatrix, xmin, xmax, ymin, ymax, cRange[0], cRange[1]);
            gl_matrix_1.mat4.transpose(tmpMatrix, tmpMatrix);
        }
        else if (model.useOffAxisProjection) {
            throw new Error('Off-Axis projection is not supported at this time');
        }
        else {
            const tmp = Math.tan(Math_1.default.radiansFromDegrees(model.viewAngle) / 2.0);
            let width;
            let height;
            if (model.useHorizontalViewAngle === true) {
                width = cRange0 * tmp;
                height = (cRange0 * tmp) / aspect;
            }
            else {
                width = cRange0 * tmp * aspect;
                height = cRange0 * tmp;
            }
            const xmin = (model.windowCenter[0] - 1.0) * width;
            const xmax = (model.windowCenter[0] + 1.0) * width;
            const ymin = (model.windowCenter[1] - 1.0) * height;
            const ymax = (model.windowCenter[1] + 1.0) * height;
            const znear = cRange[0];
            const zfar = cRange[1];
            tmpMatrix[0] = (2.0 * znear) / (xmax - xmin);
            tmpMatrix[5] = (2.0 * znear) / (ymax - ymin);
            tmpMatrix[2] = (xmin + xmax) / (xmax - xmin);
            tmpMatrix[6] = (ymin + ymax) / (ymax - ymin);
            tmpMatrix[10] = -(znear + zfar) / (zfar - znear);
            tmpMatrix[14] = -1.0;
            tmpMatrix[11] = (-2.0 * znear * zfar) / (zfar - znear);
            tmpMatrix[15] = 0.0;
        }
        gl_matrix_1.mat4.copy(result, tmpMatrix);
        return result;
    };
}
exports.default = { newInstance, extend };
//# sourceMappingURL=vtkSlabCamera.js.map