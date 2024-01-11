import { m as macro } from '../../macros2.js';
import { Device, Input } from '../../Rendering/Core/RenderWindowInteractor/Constants.js';

// ----------------------------------------------------------------------------
// vtkCompositeVRManipulator methods
// ----------------------------------------------------------------------------

function vtkCompositeVRManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCompositeVRManipulator');
  publicAPI.onButton3D = (interactor, renderer, state, device, input, pressed) => {};
  publicAPI.onMove3D = (interactor, renderer, state, device, input, pressed) => {};
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // device: null, // Device.RightController
  // input: null, // Input.TrackPad
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Create get-set macros
  macro.setGet(publicAPI, model, ['device', 'input']);

  // Object specific methods
  vtkCompositeVRManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkCompositeVRManipulator$1 = {
  extend,
  Device,
  Input
};

export { vtkCompositeVRManipulator$1 as default, extend };
