"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInstance = exports.extend = void 0;
const macros_1 = __importDefault(require("@kitware/vtk.js/macros"));
const VolumeMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/VolumeMapper"));
function vtkSharedVolumeMapper(publicAPI, model) {
    model.classHierarchy.push('vtkSharedVolumeMapper');
    const superDelete = publicAPI.delete;
    publicAPI.delete = () => {
        model.scalarTexture = null;
        superDelete();
    };
}
const DEFAULT_VALUES = {
    scalarTexture: null,
};
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    VolumeMapper_1.default.extend(publicAPI, model, initialValues);
    macros_1.default.setGet(publicAPI, model, ['scalarTexture']);
    vtkSharedVolumeMapper(publicAPI, model);
}
exports.extend = extend;
exports.newInstance = macros_1.default.newInstance(extend, 'vtkSharedVolumeMapper');
exports.default = { newInstance: exports.newInstance, extend };
//# sourceMappingURL=vtkSharedVolumeMapper.js.map