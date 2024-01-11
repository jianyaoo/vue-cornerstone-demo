import { m as macro } from '../../macros2.js';

const {
  vtkErrorMacro
} = macro;

// ----------------------------------------------------------------------------
// vtkSpline1D methods
// ----------------------------------------------------------------------------

function vtkSpline1D(publicAPI, model) {
  // Set our classname
  model.classHierarchy.push('vtkSpline1D');

  // --------------------------------------------------------------------------

  publicAPI.computeCloseCoefficients = (size, work, x, y) => {
    vtkErrorMacro(`${model.classHierarchy.slice(-1)[0]} should implement computeCloseCoefficients`);
  };

  // --------------------------------------------------------------------------

  publicAPI.computeOpenCoefficients = function (size, work, x, y) {
    vtkErrorMacro(`${model.classHierarchy.slice(-1)[0]} should implement computeOpenCoefficients`);
  };

  // --------------------------------------------------------------------------

  publicAPI.getValue = (intervalIndex, t) => {
    vtkErrorMacro(`${model.classHierarchy.slice(-1)[0]} should implement getValue`);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  vtkSpline1D(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSpline1D');

// ----------------------------------------------------------------------------

var vtkSpline1D$1 = {
  newInstance,
  extend
};

export { vtkSpline1D$1 as default, extend, newInstance };
