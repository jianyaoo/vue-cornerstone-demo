import { m as macro } from '../../macros2.js';
import vtkMapper from './Mapper.js';

// ----------------------------------------------------------------------------
// vtkSphereMapper methods
// ----------------------------------------------------------------------------

function vtkSphereMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSphereMapper');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  scaleArray: null,
  radius: 0.05,
  scaleFactor: 1.0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkMapper.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['radius', 'scaleArray', 'scaleFactor']);

  // Object methods
  vtkSphereMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSphereMapper');

// ----------------------------------------------------------------------------

var vtkSphereMapper$1 = {
  newInstance,
  extend
};

export { vtkSphereMapper$1 as default, extend, newInstance };
