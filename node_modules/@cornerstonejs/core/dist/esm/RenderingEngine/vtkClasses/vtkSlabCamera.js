import macro from '@kitware/vtk.js/macros';
import vtkCamera from '@kitware/vtk.js/Rendering/Core/Camera';
import vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { vec3, mat4 } from 'gl-matrix';
const DEFAULT_VALUES = {
    isPerformingCoordinateTransformation: false,
};
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    vtkCamera.extend(publicAPI, model, initialValues);
    macro.setGet(publicAPI, model, ['isPerformingCoordinateTransformation']);
    vtkSlabCamera(publicAPI, model);
}
const newInstance = macro.newInstance(extend, 'vtkSlabCamera');
function vtkSlabCamera(publicAPI, model) {
    model.classHierarchy.push('vtkSlabCamera');
    const tmpMatrix = mat4.identity(new Float64Array(16));
    const tmpvec1 = new Float64Array(3);
    publicAPI.getProjectionMatrix = (aspect, nearz, farz) => {
        const result = mat4.create();
        if (model.projectionMatrix) {
            const scale = 1 / model.physicalScale;
            vec3.set(tmpvec1, scale, scale, scale);
            mat4.copy(result, model.projectionMatrix);
            mat4.scale(result, result, tmpvec1);
            mat4.transpose(result, result);
            return result;
        }
        mat4.identity(tmpMatrix);
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
            mat4.ortho(tmpMatrix, xmin, xmax, ymin, ymax, cRange[0], cRange[1]);
            mat4.transpose(tmpMatrix, tmpMatrix);
        }
        else if (model.useOffAxisProjection) {
            throw new Error('Off-Axis projection is not supported at this time');
        }
        else {
            const tmp = Math.tan(vtkMath.radiansFromDegrees(model.viewAngle) / 2.0);
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
        mat4.copy(result, tmpMatrix);
        return result;
    };
}
export default { newInstance, extend };
export { newInstance, extend };
//# sourceMappingURL=vtkSlabCamera.js.map