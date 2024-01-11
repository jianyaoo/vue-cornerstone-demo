import vtk from '../../vtk.js';
import { m as macro } from '../../macros2.js';
import vtkDataSet from './DataSet.js';
import vtkPoints from '../Core/Points.js';

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// vtkPointSet methods
// ----------------------------------------------------------------------------

function vtkPointSet(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPointSet');

  // Create empty points
  if (!model.points) {
    model.points = vtkPoints.newInstance();
  } else {
    model.points = vtk(model.points);
  }
  publicAPI.getNumberOfPoints = () => model.points.getNumberOfPoints();
  publicAPI.getBounds = () => model.points.getBounds();
  publicAPI.computeBounds = () => {
    publicAPI.getBounds();
  };
  const superShallowCopy = publicAPI.shallowCopy;
  publicAPI.shallowCopy = function (other) {
    let debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    superShallowCopy(other, debug);
    model.points = vtkPoints.newInstance();
    model.points.shallowCopy(other.getPoints());
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // points: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkDataSet.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['points']);

  // Object specific methods
  vtkPointSet(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPointSet');

// ----------------------------------------------------------------------------

var vtkPointSet$1 = {
  newInstance,
  extend
};

export { vtkPointSet$1 as default, extend, newInstance };
