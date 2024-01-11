"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInstance = exports.extend = void 0;
const macros_1 = __importDefault(require("@kitware/vtk.js/macros"));
const RenderWindow_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/RenderWindow"));
const vtkStreamingOpenGLViewNodeFactory_1 = __importDefault(require("./vtkStreamingOpenGLViewNodeFactory"));
function vtkStreamingOpenGLRenderWindow(publicAPI, model) {
    model.classHierarchy.push('vtkStreamingOpenGLRenderWindow');
}
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, initialValues);
    RenderWindow_1.default.extend(publicAPI, model, initialValues);
    model.myFactory = vtkStreamingOpenGLViewNodeFactory_1.default.newInstance();
    model.myFactory.registerOverride('vtkRenderWindow', exports.newInstance);
    vtkStreamingOpenGLRenderWindow(publicAPI, model);
}
exports.extend = extend;
exports.newInstance = macros_1.default.newInstance(extend, 'vtkStreamingOpenGLRenderWindow');
exports.default = { newInstance: exports.newInstance, extend };
//# sourceMappingURL=vtkStreamingOpenGLRenderWindow.js.map