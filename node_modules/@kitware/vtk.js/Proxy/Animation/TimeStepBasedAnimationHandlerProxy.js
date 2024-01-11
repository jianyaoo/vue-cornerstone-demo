import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkTimeStepBasedAnimationHandlerProxy methods
// ----------------------------------------------------------------------------

function vtkTimeStepBasedAnimationHandlerProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkTimeStepBasedAnimationHandlerProxy');

  // Initialization ------------------------------------------------------------
  publicAPI.setTime = time => {
    model.handler.setCurrentTimeStep(time);
  };
  publicAPI.getFrames = () => {
    if (!model.handler) {
      return [];
    }
    return model.handler.getTimeSteps();
  };
  publicAPI.setInputAnimationHandler = handler => {
    model.handler = handler;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  handler: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['handler']);

  // Object specific methods
  vtkTimeStepBasedAnimationHandlerProxy(publicAPI, model);

  // Proxy handling
  macro.proxy(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkTimeStepBasedAnimationHandlerProxy');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

export { index as default, newInstance };
