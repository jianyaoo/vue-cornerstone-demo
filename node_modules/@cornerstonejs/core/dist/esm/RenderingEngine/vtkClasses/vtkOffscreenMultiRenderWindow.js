import macro from '@kitware/vtk.js/macros';
import vtkStreamingOpenGLRenderWindow from './vtkStreamingOpenGLRenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import '@kitware/vtk.js/Common/Core/Points';
import '@kitware/vtk.js/Common/Core/DataArray';
import '@kitware/vtk.js/Common/DataModel/PolyData';
import '@kitware/vtk.js/Rendering/Core/Actor';
import '@kitware/vtk.js/Rendering/Core/Mapper';
function vtkOffscreenMultiRenderWindow(publicAPI, model) {
    const invokeResize = publicAPI.invokeResize;
    delete publicAPI.invokeResize;
    model.renderWindow = vtkRenderWindow.newInstance();
    model.rendererMap = {};
    model.openGLRenderWindow = vtkStreamingOpenGLRenderWindow.newInstance();
    model.renderWindow.addView(model.openGLRenderWindow);
    model.interactor = vtkRenderWindowInteractor.newInstance();
    model.interactor.setView(model.openGLRenderWindow);
    model.interactor.initialize();
    publicAPI.addRenderer = ({ viewport, id, background }) => {
        const renderer = vtkRenderer.newInstance({
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
    publicAPI.delete = macro.chain(publicAPI.setContainer, publicAPI.destroy, model.openGLRenderWindow.delete, publicAPI.delete);
    publicAPI.resize();
}
const DEFAULT_VALUES = {
    background: [0.0, 0.0, 0.0],
    container: null,
};
export function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    macro.obj(publicAPI, model);
    macro.get(publicAPI, model, [
        'renderWindow',
        'openGLRenderWindow',
        'interactor',
        'container',
    ]);
    macro.event(publicAPI, model, 'resize');
    vtkOffscreenMultiRenderWindow(publicAPI, model);
}
export const newInstance = macro.newInstance(extend);
export default { newInstance, extend };
//# sourceMappingURL=vtkOffscreenMultiRenderWindow.js.map