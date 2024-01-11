"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInstance = exports.extend = void 0;
const macros_1 = __importDefault(require("@kitware/vtk.js/macros"));
const Actor_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Actor"));
const Actor2D_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Actor2D"));
const Camera_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Camera"));
const Glyph3DMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Glyph3DMapper"));
const ImageMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/ImageMapper"));
const ImageSlice_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/ImageSlice"));
const PixelSpaceCallbackMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/PixelSpaceCallbackMapper"));
const PolyDataMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/PolyDataMapper"));
const Renderer_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Renderer"));
const Skybox_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Skybox"));
const SphereMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/SphereMapper"));
const StickMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/StickMapper"));
const Texture_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Texture"));
const Volume_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/Volume"));
const VolumeMapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/OpenGL/VolumeMapper"));
const ViewNodeFactory_1 = __importDefault(require("@kitware/vtk.js/Rendering/SceneGraph/ViewNodeFactory"));
const vtkStreamingOpenGLVolumeMapper_1 = __importDefault(require("./vtkStreamingOpenGLVolumeMapper"));
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
function extend(publicAPI, model, initialValues = {}) {
    Object.assign(model, DEFAULT_VALUES, initialValues);
    ViewNodeFactory_1.default.extend(publicAPI, model, initialValues);
    vtkStreamingOpenGLViewNodeFactory(publicAPI, model);
    publicAPI.registerOverride('vtkActor', Actor_1.default.newInstance);
    publicAPI.registerOverride('vtkActor2D', Actor2D_1.default.newInstance);
    publicAPI.registerOverride('vtkCamera', Camera_1.default.newInstance);
    publicAPI.registerOverride('vtkGlyph3DMapper', Glyph3DMapper_1.default.newInstance);
    publicAPI.registerOverride('vtkImageMapper', ImageMapper_1.default.newInstance);
    publicAPI.registerOverride('vtkImageSlice', ImageSlice_1.default.newInstance);
    publicAPI.registerOverride('vtkMapper', PolyDataMapper_1.default.newInstance);
    publicAPI.registerOverride('vtkPixelSpaceCallbackMapper', PixelSpaceCallbackMapper_1.default.newInstance);
    publicAPI.registerOverride('vtkRenderer', Renderer_1.default.newInstance);
    publicAPI.registerOverride('vtkSkybox', Skybox_1.default.newInstance);
    publicAPI.registerOverride('vtkSphereMapper', SphereMapper_1.default.newInstance);
    publicAPI.registerOverride('vtkStickMapper', StickMapper_1.default.newInstance);
    publicAPI.registerOverride('vtkTexture', Texture_1.default.newInstance);
    publicAPI.registerOverride('vtkVolume', Volume_1.default.newInstance);
    publicAPI.registerOverride('vtkVolumeMapper', VolumeMapper_1.default.newInstance);
    publicAPI.registerOverride('vtkSharedVolumeMapper', vtkStreamingOpenGLVolumeMapper_1.default.newInstance);
}
exports.extend = extend;
exports.newInstance = macros_1.default.newInstance(extend, 'vtkStreamingOpenGLViewNodeFactory');
exports.default = { newInstance: exports.newInstance, extend };
//# sourceMappingURL=vtkStreamingOpenGLViewNodeFactory.js.map