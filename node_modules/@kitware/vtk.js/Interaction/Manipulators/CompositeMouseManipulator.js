import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkCompositeMouseManipulator methods
// ----------------------------------------------------------------------------

function vtkCompositeMouseManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCompositeMouseManipulator');
  publicAPI.startInteraction = () => {};
  publicAPI.endInteraction = () => {};
  publicAPI.onButtonDown = (interactor, renderer, position) => {};
  publicAPI.onButtonUp = interactor => {};
  publicAPI.onMouseMove = (interactor, renderer, position) => {};
  publicAPI.onStartScroll = (interactor, renderer, delta) => {};
  publicAPI.onScroll = (interactor, renderer, delta) => {};
  publicAPI.onEndScroll = interactor => {};
  publicAPI.isDragEnabled = () => model.dragEnabled;
  publicAPI.isScrollEnabled = () => model.scrollEnabled;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  button: 1,
  shift: false,
  control: false,
  alt: false,
  dragEnabled: true,
  scrollEnabled: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Create get-set macros
  macro.setGet(publicAPI, model, ['button', 'shift', 'control', 'alt']);
  macro.set(publicAPI, model, ['dragEnabled', 'scrollEnabled']);

  // Object specific methods
  vtkCompositeMouseManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkCompositeMouseManipulator$1 = {
  extend
};

export { vtkCompositeMouseManipulator$1 as default, extend };
