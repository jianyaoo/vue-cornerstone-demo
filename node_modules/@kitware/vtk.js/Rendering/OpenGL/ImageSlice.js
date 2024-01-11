import { mat4 } from 'gl-matrix';
import { n as newInstance$1, o as obj, e as setGet } from '../../macros2.js';
import vtkViewNode from '../SceneGraph/ViewNode.js';
import { registerOverride } from './ViewNodeFactory.js';

// ----------------------------------------------------------------------------
// vtkOpenGLImageSlice methods
// ----------------------------------------------------------------------------

function vtkOpenGLImageSlice(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLImageSlice');

  // Builds myself.
  publicAPI.buildPass = prepass => {
    if (!model.renderable || !model.renderable.getVisibility()) {
      return;
    }
    if (prepass) {
      if (!model.renderable) {
        return;
      }
      model._openGLRenderWindow = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow');
      model._openGLRenderer = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
      model.context = model._openGLRenderWindow.getContext();
      publicAPI.prepareNodes();
      publicAPI.addMissingNode(model.renderable.getMapper());
      publicAPI.removeUnusedNodes();
    }
  };
  publicAPI.traverseZBufferPass = renderPass => {
    if (!model.renderable || !model.renderable.getNestedVisibility() || model._openGLRenderer.getSelector() && !model.renderable.getNestedPickable()) {
      return;
    }
    publicAPI.apply(renderPass, true);
    model.children.forEach(child => {
      child.traverse(renderPass);
    });
    publicAPI.apply(renderPass, false);
  };
  publicAPI.traverseOpaqueZBufferPass = renderPass => publicAPI.traverseOpaquePass(renderPass);

  // we draw textures, then mapper, then post pass textures
  publicAPI.traverseOpaquePass = renderPass => {
    if (!model.renderable || !model.renderable.getNestedVisibility() || !model.renderable.getIsOpaque() || model._openGLRenderer.getSelector() && !model.renderable.getNestedPickable()) {
      return;
    }
    publicAPI.apply(renderPass, true);
    model.children.forEach(child => {
      child.traverse(renderPass);
    });
    publicAPI.apply(renderPass, false);
  };

  // we draw textures, then mapper, then post pass textures
  publicAPI.traverseTranslucentPass = renderPass => {
    if (!model.renderable || !model.renderable.getNestedVisibility() || model.renderable.getIsOpaque() || model._openGLRenderer.getSelector() && !model.renderable.getNestedPickable()) {
      return;
    }
    publicAPI.apply(renderPass, true);
    model.children.forEach(child => {
      child.traverse(renderPass);
    });
    publicAPI.apply(renderPass, false);
  };
  publicAPI.queryPass = (prepass, renderPass) => {
    if (prepass) {
      if (!model.renderable || !model.renderable.getVisibility()) {
        return;
      }
      if (model.renderable.getIsOpaque()) {
        renderPass.incrementOpaqueActorCount();
      } else {
        renderPass.incrementTranslucentActorCount();
      }
    }
  };
  publicAPI.zBufferPass = (prepass, renderPass) => publicAPI.opaquePass(prepass, renderPass);
  publicAPI.opaqueZBufferPass = (prepass, renderPass) => publicAPI.opaquePass(prepass, renderPass);

  // Renders myself
  publicAPI.opaquePass = (prepass, renderPass) => {
    if (prepass) {
      model.context.depthMask(true);
    }
  };

  // Renders myself
  publicAPI.translucentPass = (prepass, renderPass) => {
    model.context.depthMask(!prepass);
  };
  publicAPI.getKeyMatrices = () => {
    // has the actor changed?
    if (model.renderable.getMTime() > model.keyMatrixTime.getMTime()) {
      mat4.copy(model.keyMatrices.mcwc, model.renderable.getMatrix());
      mat4.transpose(model.keyMatrices.mcwc, model.keyMatrices.mcwc);
      model.keyMatrixTime.modified();
    }
    return model.keyMatrices;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  context: null,
  keyMatrixTime: null,
  keyMatrices: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkViewNode.extend(publicAPI, model, initialValues);
  model.keyMatrixTime = {};
  obj(model.keyMatrixTime, {
    mtime: 0
  });
  model.keyMatrices = {
    mcwc: mat4.identity(new Float64Array(16))
  };

  // Build VTK API
  setGet(publicAPI, model, ['context']);

  // Object methods
  vtkOpenGLImageSlice(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = newInstance$1(extend, 'vtkOpenGLImageSlice');

// ----------------------------------------------------------------------------

var vtkImageSlice = {
  newInstance,
  extend
};

// Register ourself to OpenGL backend if imported
registerOverride('vtkImageSlice', newInstance);

export { vtkImageSlice as default, extend, newInstance };
