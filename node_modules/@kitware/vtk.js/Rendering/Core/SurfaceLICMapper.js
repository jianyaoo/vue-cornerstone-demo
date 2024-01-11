import { m as macro } from '../../macros2.js';
import vtkMapper from './Mapper.js';
import vtkSurfaceLICInterface from './SurfaceLICInterface.js';

// ----------------------------------------------------------------------------
// vtkSurfaceLICMapper methods
// ----------------------------------------------------------------------------

function vtkSurfaceLICMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSurfaceLICMapper');
  publicAPI.getLicInterface = () => {
    if (!model.licInterface) {
      model.licInterface = vtkSurfaceLICInterface.newInstance();
    }
    return model.licInterface;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  licInterface: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkMapper.extend(publicAPI, model, initialValues);
  macro.set(publicAPI, model, ['licInterface']);

  // Object methods
  vtkSurfaceLICMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSurfaceLICMapper');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

export { index as default, extend, newInstance };
