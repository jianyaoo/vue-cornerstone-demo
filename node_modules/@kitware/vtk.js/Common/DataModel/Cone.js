import { m as macro } from '../../macros2.js';
import { r as radiansFromDegrees } from '../Core/Math/index.js';

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// vtkCone methods
// ----------------------------------------------------------------------------

function vtkCone(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCone');
  publicAPI.evaluateFunction = x => {
    const tanTheta = Math.tan(radiansFromDegrees(model.angle));
    const retVal = x[1] * x[1] + x[2] * x[2] - x[0] * x[0] * tanTheta * tanTheta;
    return retVal;
  };
  publicAPI.evaluateGradient = x => {
    const tanTheta = Math.tan(radiansFromDegrees(model.angle));
    const retVal = [-2.0 * x[0] * tanTheta * tanTheta, 2.0 * x[1], 2.0 * x[2]];
    return retVal;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {
  angle: 15.0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['angle']);
  vtkCone(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkCone');

// ----------------------------------------------------------------------------

var vtkCone$1 = {
  newInstance,
  extend
};

export { vtkCone$1 as default, extend, newInstance };
