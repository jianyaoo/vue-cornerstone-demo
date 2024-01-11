import { m as macro } from '../../macros2.js';
import vtkMapper from './Mapper.js';

// ----------------------------------------------------------------------------
// vtkStickMapper methods
// ----------------------------------------------------------------------------

function vtkStickMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkStickMapper');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  scaleArray: null,
  orientationArray: null,
  radius: 0.025,
  length: 0.1
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkMapper.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['scaleArray', 'orientationArray', 'radius', 'length']);

  // Object methods
  vtkStickMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkStickMapper');

// ----------------------------------------------------------------------------

var vtkStickMapper$1 = {
  newInstance,
  extend
};

export { vtkStickMapper$1 as default, extend, newInstance };
