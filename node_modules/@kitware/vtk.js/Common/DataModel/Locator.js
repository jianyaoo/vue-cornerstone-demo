import { m as macro } from '../../macros2.js';

function vtkLocator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLocator');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  dataSet: null,
  maxLevel: 8,
  // TODO: clamp 0, Number.MAX_VALUE
  level: 8,
  automatic: false,
  tolerance: 0.0,
  // TODO: clamp 0.0, Number.MAX_VALUE
  useExistingSearchStructure: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['level']);
  macro.setGet(publicAPI, model, ['dataSet', 'maxLevel', 'automatic', 'tolerance', 'useExistingSearchStructure']);

  // Object specific methods
  vtkLocator(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkLocator$1 = {
  extend
};

export { vtkLocator$1 as default, extend };
