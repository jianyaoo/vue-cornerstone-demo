import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------

function vtkRenderPass(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkRenderPass');
  publicAPI.getOperation = () => model.currentOperation;
  publicAPI.setCurrentOperation = val => {
    model.currentOperation = val;
    model.currentTraverseOperation = `traverse${macro.capitalize(model.currentOperation)}`;
  };
  publicAPI.getTraverseOperation = () => model.currentTraverseOperation;

  // by default this class will traverse all of its
  // preDelegateOperations, then call its delegate render passes
  // the traverse all of its postDelegateOperations
  // any of those three arrays can be empty
  publicAPI.traverse = function (viewNode) {
    let parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (model.deleted) {
      return;
    }

    // we just render our delegates in order
    model._currentParent = parent;
    model.preDelegateOperations.forEach(val => {
      publicAPI.setCurrentOperation(val);
      viewNode.traverse(publicAPI);
    });
    model.delegates.forEach(val => {
      val.traverse(viewNode, publicAPI);
    });
    model.postDelegateOperations.forEach(val => {
      publicAPI.setCurrentOperation(val);
      viewNode.traverse(publicAPI);
    });
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  delegates: [],
  currentOperation: null,
  preDelegateOperations: [],
  postDelegateOperations: [],
  currentParent: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['currentOperation']);
  macro.setGet(publicAPI, model, ['delegates', '_currentParent', 'preDelegateOperations', 'postDelegateOperations']);
  macro.moveToProtected(publicAPI, model, ['currentParent']);

  // Object methods
  vtkRenderPass(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkRenderPass');

// ----------------------------------------------------------------------------

var vtkRenderPass$1 = {
  newInstance,
  extend
};

export { vtkRenderPass$1 as default, extend, newInstance };
