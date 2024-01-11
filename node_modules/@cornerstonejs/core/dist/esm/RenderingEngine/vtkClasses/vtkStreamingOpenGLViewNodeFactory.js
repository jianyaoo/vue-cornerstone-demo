import macro from '@kitware/vtk.js/macros';
import vtkOpenGLActor from '@kitware/vtk.js/Rendering/OpenGL/Actor';
import vtkOpenGLActor2D from '@kitware/vtk.js/Rendering/OpenGL/Actor2D';
import vtkOpenGLCamera from '@kitware/vtk.js/Rendering/OpenGL/Camera';
import vtkOpenGLGlyph3DMapper from '@kitware/vtk.js/Rendering/OpenGL/Glyph3DMapper';
import vtkOpenGLImageMapper from '@kitware/vtk.js/Rendering/OpenGL/ImageMapper';
import vtkOpenGLImageSlice from '@kitware/vtk.js/Rendering/OpenGL/ImageSlice';
import vtkOpenGLPixelSpaceCallbackMapper from '@kitware/vtk.js/Rendering/OpenGL/PixelSpaceCallbackMapper';
import vtkOpenGLPolyDataMapper from '@kitware/vtk.js/Rendering/OpenGL/PolyDataMapper';
import vtkOpenGLRenderer from '@kitware/vtk.js/Rendering/OpenGL/Renderer';
import vtkOpenGLSkybox from '@kitware/vtk.js/Rendering/OpenGL/Skybox';
import vtkOpenGLSphereMapper from '@kitware/vtk.js/Rendering/OpenGL/SphereMapper';
import vtkOpenGLStickMapper from '@kitware/vtk.js/Rendering/OpenGL/StickMapper';
import vtkOpenGLTexture from '@kitware/vtk.js/Rendering/OpenGL/Texture';
import vtkOpenGLVolume from '@kitware/vtk.js/Rendering/OpenGL/Volume';
import vtkOpenGLVolumeMapper from '@kitware/vtk.js/Rendering/OpenGL/VolumeMapper';
import vtkViewNodeFactory from '@kitware/vtk.js/Rendering/SceneGraph/ViewNodeFactory';
import vtkStreamingOpenGLVolumeMapper from './vtkStreamingOpenGLVolumeMapper';
function vtkStreamingOpenGLViewNodeFactory(publicAPI, model) {
    model.classHierarchy.push('vtkStreamingOpenGLViewNodeFactory');
    publicAPI.createNode = (dataObject) => {
        if (dataObject.isDeleted()) {
            return null;
        }
        let cpt = 0;
        let className = dataObject.getClassName(cpt++);
        let isObject = false;
        const keys = Object.keys(model.overrides);
        while (className && !isObject) {
            if (keys.indexOf(className) !== -1) {
                isObject = true;
            }
            else {
                className = dataObject.getClassName(cpt++);
            }
        }
        if (!isObject) {
            return null;
        }
        const initialValues = model.getModelInitialValues(dataObject);
        const vn = model.overrides[className](initialValues);
        vn.setMyFactory(publicAPI);
        return vn;
    };
    model.getModelInitialValues = (dataObject) => {
        const initialValues = {};
        const className = dataObject.getClassName();
        if (className === 'vtkSharedVolumeMapper') {
            initialValues.scalarTexture = dataObject.getScalarTexture();
        }
        return initialValues;
    };
}
const DEFAULT_VALUES = {};
export function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    vtkViewNodeFactory.extend(publicAPI, model, initialValues);
    vtkStreamingOpenGLViewNodeFactory(publicAPI, model);
    publicAPI.registerOverride('vtkActor', vtkOpenGLActor.newInstance);
    publicAPI.registerOverride('vtkActor2D', vtkOpenGLActor2D.newInstance);
    publicAPI.registerOverride('vtkCamera', vtkOpenGLCamera.newInstance);
    publicAPI.registerOverride('vtkGlyph3DMapper', vtkOpenGLGlyph3DMapper.newInstance);
    publicAPI.registerOverride('vtkImageMapper', vtkOpenGLImageMapper.newInstance);
    publicAPI.registerOverride('vtkImageSlice', vtkOpenGLImageSlice.newInstance);
    publicAPI.registerOverride('vtkMapper', vtkOpenGLPolyDataMapper.newInstance);
    publicAPI.registerOverride('vtkPixelSpaceCallbackMapper', vtkOpenGLPixelSpaceCallbackMapper.newInstance);
    publicAPI.registerOverride('vtkRenderer', vtkOpenGLRenderer.newInstance);
    publicAPI.registerOverride('vtkSkybox', vtkOpenGLSkybox.newInstance);
    publicAPI.registerOverride('vtkSphereMapper', vtkOpenGLSphereMapper.newInstance);
    publicAPI.registerOverride('vtkStickMapper', vtkOpenGLStickMapper.newInstance);
    publicAPI.registerOverride('vtkTexture', vtkOpenGLTexture.newInstance);
    publicAPI.registerOverride('vtkVolume', vtkOpenGLVolume.newInstance);
    publicAPI.registerOverride('vtkVolumeMapper', vtkOpenGLVolumeMapper.newInstance);
    publicAPI.registerOverride('vtkSharedVolumeMapper', vtkStreamingOpenGLVolumeMapper.newInstance);
}
export const newInstance = macro.newInstance(extend, 'vtkStreamingOpenGLViewNodeFactory');
export default { newInstance, extend };
//# sourceMappingURL=vtkStreamingOpenGLViewNodeFactory.js.map