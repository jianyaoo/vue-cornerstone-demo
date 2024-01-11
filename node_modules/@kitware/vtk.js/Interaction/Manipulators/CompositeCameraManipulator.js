import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkCompositeCameraManipulator methods
// ----------------------------------------------------------------------------

function vtkCompositeCameraManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCompositeCameraManipulator');

  //-------------------------------------------------------------------------
  publicAPI.computeDisplayCenter = (iObserver, renderer) => {
    const pt = iObserver.computeWorldToDisplay(renderer, model.center[0], model.center[1], model.center[2]);
    model.displayCenter[0] = pt[0];
    model.displayCenter[1] = pt[1];
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  center: [0, 0, 0],
  rotationFactor: 1,
  displayCenter: [0, 0]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Create get-set macros
  macro.setGet(publicAPI, model, ['rotationFactor']);
  macro.setGetArray(publicAPI, model, ['displayCenter'], 2);
  macro.setGetArray(publicAPI, model, ['center'], 3);

  // Object specific methods
  vtkCompositeCameraManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkCompositeCameraManipulator$1 = {
  extend
};

export { vtkCompositeCameraManipulator$1 as default, extend };
