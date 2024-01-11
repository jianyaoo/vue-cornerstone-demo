import { m as macro } from '../../macros2.js';
import vtkLocator from './Locator.js';

function vtkAbstractPointLocator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkAbstractPointLocator');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    bounds: null,
    numberOfBuckets: 0,
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkLocator.extend(publicAPI, model, defaultValues(initialValues));

  // Make this a VTK object
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['numberOfBuckets']);
  macro.setGetArray(publicAPI, model, ['bounds'], 6);

  // Object specific methods
  vtkAbstractPointLocator(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkAbstractPointLocator$1 = {
  extend
};

export { vtkAbstractPointLocator$1 as default, extend };
