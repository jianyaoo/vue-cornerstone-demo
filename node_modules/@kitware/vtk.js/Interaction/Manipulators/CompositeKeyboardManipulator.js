// ----------------------------------------------------------------------------
// vtkCompositeKeyboardManipulator methods
// ----------------------------------------------------------------------------

function vtkCompositeKeyboardManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCompositeKeyboardManipulator');
  publicAPI.onKeyPress = (interactor, renderer, key) => {};
  publicAPI.onKeyDown = (interactor, renderer, key) => {};
  publicAPI.onKeyUp = (interactor, renderer, key) => {};
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object specific methods
  vtkCompositeKeyboardManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkCompositeKeyboardManipulator$1 = {
  extend
};

export { vtkCompositeKeyboardManipulator$1 as default, extend };
