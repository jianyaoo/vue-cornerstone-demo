import { m as macro } from '../../macros2.js';
import { d as dot } from '../Core/Math/index.js';

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

function evaluate(radius, center, axis, x) {
  const x2C = new Float32Array(3);
  x2C[0] = x[0] - center[0];
  x2C[1] = x[1] - center[1];
  x2C[2] = x[2] - center[2];
  const proj = dot(axis, x2C);
  const retVal = dot(x2C, x2C) - proj * proj - radius * radius;
  return retVal;
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

const STATIC = {
  evaluate
};

// ----------------------------------------------------------------------------
// vtkCylinder methods
// ----------------------------------------------------------------------------

function vtkCylinder(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCylinder');
  publicAPI.evaluateFunction = xyz => {
    const x2C = [xyz[0] - model.center[0], xyz[1] - model.center[1], xyz[2] - model.center[2]];
    const proj = dot(model.axis, x2C);
    const retVal = dot(x2C, x2C) - proj * proj - model.radius * model.radius;
    return retVal;
  };
  publicAPI.evaluateGradient = xyz => {
    const t = model.axis[0] * (xyz[0] - model.center[0]) + model.axis[1] * (xyz[1] - model.center[1]) + model.axis[2] * (xyz[2] - model.center[2]);
    const cp = [model.center[0] + t * model.axis[0], model.center[1] + t * model.axis[1], model.center[2] + t * model.axis[2]];
    const retVal = [2.0 * (xyz[0] - cp[0]), 2.0 * (xyz[1] - cp[1]), 2.0 * (xyz[2] - cp[2])];
    return retVal;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {
  radius: 0.5,
  center: [0.0, 0.0, 0.0],
  axis: [0.0, 1.0, 0.0]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['radius']);
  macro.setGetArray(publicAPI, model, ['center', 'axis'], 3);
  vtkCylinder(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkCylinder');

// ----------------------------------------------------------------------------

var vtkCylinder$1 = {
  newInstance,
  extend,
  ...STATIC
};

export { STATIC, vtkCylinder$1 as default, extend, newInstance };
