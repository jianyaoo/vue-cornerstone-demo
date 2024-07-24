import macro from '@kitware/vtk.js/macros';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkStreamingOpenGLViewNodeFactory, { registerOverride, } from './vtkStreamingOpenGLViewNodeFactory';
function vtkStreamingOpenGLRenderWindow(publicAPI, model) {
    model.classHierarchy.push('vtkStreamingOpenGLRenderWindow');
}
export function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, initialValues);
    vtkOpenGLRenderWindow.extend(publicAPI, model, initialValues);
    model.myFactory = vtkStreamingOpenGLViewNodeFactory.newInstance();
    registerOverride('vtkRenderWindow', newInstance);
    vtkStreamingOpenGLRenderWindow(publicAPI, model);
}
export const newInstance = macro.newInstance(extend, 'vtkStreamingOpenGLRenderWindow');
export default { newInstance, extend };
//# sourceMappingURL=vtkStreamingOpenGLRenderWindow.js.map