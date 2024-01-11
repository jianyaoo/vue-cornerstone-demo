import { n as newInstance$1 } from '../../macros2.js';
import vtkScalarBarActor from '../Core/ScalarBarActor.js';
import vtkViewNode from '../SceneGraph/ViewNode.js';
import { registerOverride } from './ViewNodeFactory.js';

// ----------------------------------------------------------------------------
// vtkOpenGLScalarBarActor methods
// ----------------------------------------------------------------------------

function vtkOpenGLScalarBarActor(publicAPI, model) {
  model.classHierarchy.push('vtkOpenGLScalarBarActor');

  // Builds myself.
  publicAPI.buildPass = prepass => {
    if (prepass) {
      model._openGLRenderer = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
      model._openGLRenderWindow = model._openGLRenderer.getParent();
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
      const camera = model._openGLRenderer ? model._openGLRenderer.getRenderable().getActiveCamera() : null;
      const tsize = model._openGLRenderer.getTiledSizeAndOrigin();
      model.scalarBarActorHelper.updateAPISpecificData([tsize.usize, tsize.vsize], camera, model._openGLRenderWindow.getRenderable());
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
  vtkOpenGLScalarBarActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = newInstance$1(extend, 'vtkOpenGLScalarBarActor');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

// Register ourself to OpenGL backend if imported
registerOverride('vtkScalarBarActor', newInstance);

export { index as default, extend, newInstance };
