import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkAbstractAnimationProxy methods
// ----------------------------------------------------------------------------

function vtkAbstractAnimationProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkAbstractAnimationProxy');

  // Initialization ------------------------------------------------------------
  publicAPI.setTime = time => {};
  publicAPI.getFrames = () => [];
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.obj(publicAPI, model);

  // Object specific methods
  vtkAbstractAnimationProxy(publicAPI, model);

  // Proxy handling
  macro.proxy(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkAbstractAnimationProxy');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

export { index as default, newInstance };
