import { n as newInstance$1 } from '../../macros2.js';
import vtkCubeAxesActor from '../Core/CubeAxesActor.js';
import vtkViewNode from '../SceneGraph/ViewNode.js';
import { registerOverride } from './ViewNodeFactory.js';

// ----------------------------------------------------------------------------
// vtkOpenGLCubeAxesActor methods
// ----------------------------------------------------------------------------

function vtkOpenGLCubeAxesActor(publicAPI, model) {
  model.classHierarchy.push('vtkOpenGLCubeAxesActor');

  // Builds myself.
  publicAPI.buildPass = prepass => {
    if (prepass) {
      model._openGLRenderer = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
      model._openGLRenderWindow = model._openGLRenderer.getParent();
      if (!model.CubeAxesActorHelper.getRenderable()) {
        model.CubeAxesActorHelper.setRenderable(model.renderable);
      }
      publicAPI.prepareNodes();
      publicAPI.addMissingNode(model.CubeAxesActorHelper.getTmActor());
      publicAPI.addMissingNode(model.renderable.getGridActor());
      publicAPI.removeUnusedNodes();
    }
  };
  publicAPI.opaquePass = (prepass, renderPass) => {
    if (prepass) {
      const camera = model._openGLRenderer ? model._openGLRenderer.getRenderable().getActiveCamera() : null;
      const tsize = model._openGLRenderer.getTiledSizeAndOrigin();
      model.CubeAxesActorHelper.updateAPISpecificData([tsize.usize, tsize.vsize], camera, model._openGLRenderWindow.getRenderable());
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
  model.CubeAxesActorHelper = vtkCubeAxesActor.newCubeAxesActorHelper();

  // Object methods
  vtkOpenGLCubeAxesActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = newInstance$1(extend, 'vtkOpenGLCubeAxesActor');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

// Register ourself to OpenGL backend if imported
registerOverride('vtkCubeAxesActor', newInstance);

export { index as default, extend, newInstance };
