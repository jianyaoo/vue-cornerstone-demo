"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInstance = exports.extend = void 0;
const macros_1 = __importDefault(require("@kitware/vtk.js/macros"));
const RenderWindow_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/RenderWindow"));
const vtkStreamingOpenGLViewNodeFactory_1 = __importStar(require("./vtkStreamingOpenGLViewNodeFactory"));
function vtkStreamingOpenGLRenderWindow(publicAPI, model) {
    model.classHierarchy.push('vtkStreamingOpenGLRenderWindow');
}
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, initialValues);
    RenderWindow_1.default.extend(publicAPI, model, initialValues);
    model.myFactory = vtkStreamingOpenGLViewNodeFactory_1.default.newInstance();
    (0, vtkStreamingOpenGLViewNodeFactory_1.registerOverride)('vtkRenderWindow', exports.newInstance);
    vtkStreamingOpenGLRenderWindow(publicAPI, model);
}
exports.extend = extend;
exports.newInstance = macros_1.default.newInstance(extend, 'vtkStreamingOpenGLRenderWindow');
exports.default = { newInstance: exports.newInstance, extend };
//# sourceMappingURL=vtkStreamingOpenGLRenderWindow.js.map