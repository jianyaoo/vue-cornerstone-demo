import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkWebGPUShaderModule methods
// ----------------------------------------------------------------------------

function vtkWebGPUShaderModule(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWebGPUShaderModule');
  publicAPI.initialize = (device, shaderDesc) => {
    model.device = device;
    // console.log(shaderDesc.getCode());
    model.handle = model.device.getHandle().createShaderModule({
      code: shaderDesc.getCode()
    });
  };

  // publicAPI.setLastCameraMTime = (mtime) => {
  //   model.lastCameraMTime = mtime;
  // };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  device: null,
  handle: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['lastCameraMTime']);
  macro.setGet(publicAPI, model, ['device', 'handle']);

  // Object methods
  vtkWebGPUShaderModule(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkWebGPUShaderModule');

// ----------------------------------------------------------------------------

var vtkWebGPUShaderModule$1 = {
  newInstance,
  extend
};

export { vtkWebGPUShaderModule$1 as default };
