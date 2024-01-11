"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInstance = exports.extend = void 0;
const macros_1 = __importDefault(require("@kitware/vtk.js/macros"));
const vtkStreamingOpenGLRenderWindow_1 = __importDefault(require("./vtkStreamingOpenGLRenderWindow"));
const Renderer_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Renderer"));
const RenderWindow_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/RenderWindow"));
const RenderWindowInteractor_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/RenderWindowInteractor"));
require("@kitware/vtk.js/Common/Core/Points");
require("@kitware/vtk.js/Common/Core/DataArray");
require("@kitware/vtk.js/Common/DataModel/PolyData");
require("@kitware/vtk.js/Rendering/Core/Actor");
require("@kitware/vtk.js/Rendering/Core/Mapper");
function vtkOffscreenMultiRenderWindow(publicAPI, model) {
    const invokeResize = publicAPI.invokeResize;
    delete publicAPI.invokeResize;
    model.renderWindow = RenderWindow_1.default.newInstance();
    model.rendererMap = {};
    model.openGLRenderWindow = vtkStreamingOpenGLRenderWindow_1.default.newInstance();
    model.renderWindow.addView(model.openGLRenderWindow);
    model.interactor = RenderWindowInteractor_1.default.newInstance();
    model.interactor.setView(model.openGLRenderWindow);
    model.interactor.initialize();
    publicAPI.addRenderer = ({ viewport, id, background }) => {
        const renderer = Renderer_1.default.newInstance({
            viewport,
            background: background || model.background,
        });
        model.renderWindow.addRenderer(renderer);
        model.rendererMap[id] = renderer;
    };
    publicAPI.destroy = () => {
        const rwi = model.renderWindow.getInteractor();
        rwi.delete();
    };
    publicAPI.removeRenderer = (id) => {
        const renderer = publicAPI.getRenderer(id);
        model.renderWindow.removeRenderer(renderer);
        renderer.delete();
        delete model.rendererMap[id];
    };
    publicAPI.getRenderer = (id) => {
        return model.rendererMap[id];
    };
    publicAPI.getRenderers = () => {
        const { rendererMap } = model;
        const renderers = Object.keys(rendererMap).map((id) => {
            return { id, renderer: rendererMap[id] };
        });
        return renderers;
    };
    publicAPI.resize = () => {
        if (model.container) {
            const { width, height } = model.container;
            model.openGLRenderWindow.setSize(Math.floor(width), Math.floor(height));
            invokeResize();
            model.renderWindow.render();
        }
    };
    publicAPI.setContainer = (el) => {
        model.container = el;
        model.openGLRenderWindow.setContainer(model.container);
    };
    publicAPI.delete = macros_1.default.chain(publicAPI.setContainer, publicAPI.destroy, model.openGLRenderWindow.delete, publicAPI.delete);
    publicAPI.resize();
}
const DEFAULT_VALUES = {
    background: [0.0, 0.0, 0.0],
    container: null,
};
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    macros_1.default.obj(publicAPI, model);
    macros_1.default.get(publicAPI, model, [
        'renderWindow',
        'openGLRenderWindow',
        'interactor',
        'container',
    ]);
    macros_1.default.event(publicAPI, model, 'resize');
    vtkOffscreenMultiRenderWindow(publicAPI, model);
}
exports.extend = extend;
exports.newInstance = macros_1.default.newInstance(extend);
exports.default = { newInstance: exports.newInstance, extend };
//# sourceMappingURL=vtkOffscreenMultiRenderWindow.js.map