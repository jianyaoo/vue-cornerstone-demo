import { m as macro } from '../../macros2.js';
import vtkViewNodeFactory from '../SceneGraph/ViewNodeFactory.js';

const CLASS_MAPPING = Object.create(null);
function registerOverride(className, fn) {
  CLASS_MAPPING[className] = fn;
}

// ----------------------------------------------------------------------------
// vtkWebGPUViewNodeFactory methods
// ----------------------------------------------------------------------------

function vtkWebGPUViewNodeFactory(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWebGPUViewNodeFactory');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Static class mapping shared across instances
  model.overrides = CLASS_MAPPING;

  // Inheritance
  vtkViewNodeFactory.extend(publicAPI, model, initialValues);

  // Object methods
  vtkWebGPUViewNodeFactory(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkWebGPUViewNodeFactory');

// ----------------------------------------------------------------------------

var vtkWebGPUViewNodeFactory$1 = {
  newInstance,
  extend
};

export { vtkWebGPUViewNodeFactory$1 as default, extend, newInstance, registerOverride };
