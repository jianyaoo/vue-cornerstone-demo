import { n as newInstance$1 } from '../../macros2.js';
import vtkScalarBarActor from '../Core/ScalarBarActor.js';
import vtkViewNode from '../SceneGraph/ViewNode.js';
import { registerOverride } from './ViewNodeFactory.js';

// ----------------------------------------------------------------------------
// vtkWebGPUScalarBarActor methods
// ----------------------------------------------------------------------------

function vtkWebGPUScalarBarActor(publicAPI, model) {
  model.classHierarchy.push('vtkWebGPUScalarBarActor');

  // Builds myself.
  publicAPI.buildPass = prepass => {
    if (prepass) {
      model.WebGPURenderer = publicAPI.getFirstAncestorOfType('vtkWebGPURenderer');
      model.WebGPURenderWindow = model.WebGPURenderer.getParent();
      if (!model.scalarBarActorHelper.getRenderable()) {
        model.scalarBarActorHelper.setRenderable(model.renderable);
      }
      publicAPI.prepareNodes();
      publicAPI.addMissingNode(model.scalarBarActorHelper.getBarActor());
      publicAPI.addMissingNode(model.scalarBarActorHelper.getTmActor());
      publicAPI.removeUnusedNodes();
    }
  };
  publicAPI.opaquePass = (prepass, renderPass) => {
    if (prepass) {
      const camera = model.WebGPURenderer ? model.WebGPURenderer.getRenderable().getActiveCamera() : null;
      const tsize = model.WebGPURenderer.getTiledSizeAndOrigin();
      model.scalarBarActorHelper.updateAPISpecificData([tsize.usize, tsize.vsize], camera, model.WebGPURenderWindow.getRenderable());
    }
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
  model.scalarBarActorHelper = vtkScalarBarActor.newScalarBarActorHelper();

  // Object methods
  vtkWebGPUScalarBarActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = newInstance$1(extend, 'vtkWebGPUScalarBarActor');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

// Register ourself to WebGPU backend if imported
registerOverride('vtkScalarBarActor', newInstance);

export { index as default, extend, newInstance };
