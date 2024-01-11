import { m as macro } from '../../macros2.js';
import vtkViewNode from '../SceneGraph/ViewNode.js';
import { registerOverride } from './ViewNodeFactory.js';

// ----------------------------------------------------------------------------
// vtkWebGPUPixelSpaceCallbackMapper methods
// ----------------------------------------------------------------------------

function vtkWebGPUPixelSpaceCallbackMapper(publicAPI, model) {
  model.classHierarchy.push('vtkWebGPUPixelSpaceCallbackMapper');
  publicAPI.opaquePass = (prepass, renderPass) => {
    model.WebGPURenderer = publicAPI.getFirstAncestorOfType('vtkWebGPURenderer');
    model.WebGPURenderWindow = model.WebGPURenderer.getParent();
    const aspectRatio = model.WebGPURenderer.getAspectRatio();
    const camera = model.WebGPURenderer ? model.WebGPURenderer.getRenderable().getActiveCamera() : null;
    const tsize = model.WebGPURenderer.getTiledSizeAndOrigin();
    const texels = null;
    if (model.renderable.getUseZValues()) ;
    model.renderable.invokeCallback(model.renderable.getInputData(), camera, aspectRatio, tsize, texels);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkViewNode.extend(publicAPI, model, initialValues);

  // Object methods
  vtkWebGPUPixelSpaceCallbackMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkWebGPUPixelSpaceCallbackMapper');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

// Register ourself to WebGPU backend if imported
registerOverride('vtkPixelSpaceCallbackMapper', newInstance);

export { index as default, extend, newInstance };
