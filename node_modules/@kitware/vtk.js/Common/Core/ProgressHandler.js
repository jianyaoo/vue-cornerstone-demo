import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkProgressHandler methods
// ----------------------------------------------------------------------------

function vtkProgressHandler(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkProgressHandler');
  publicAPI.startWork = () => {
    model.workCount += 1;
    if (model.workCount === 1) {
      publicAPI.invokeChange(true);
    }
  };
  publicAPI.stopWork = () => {
    model.workCount -= 1;
    if (model.workCount === 0) {
      publicAPI.invokeChange(false);
    }
  };
  publicAPI.isWorking = () => !!model.workCount;
  publicAPI.wrapPromise = promise => {
    publicAPI.startWork();
    return new Promise((resolve, reject) => {
      promise.then(function () {
        publicAPI.stopWork();
        resolve(...arguments);
      }, rejectError => {
        publicAPI.stopWork();
        reject(rejectError);
      });
    });
  };
  publicAPI.wrapPromiseFunction = fn => function () {
    return publicAPI.wrapPromise(fn(...arguments));
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  workCount: 0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.event(publicAPI, model, 'change');
  macro.get(publicAPI, model, ['workCount']);

  // Object specific methods
  vtkProgressHandler(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkProgressHandler');

// ----------------------------------------------------------------------------

var vtkProgressHandler$1 = {
  newInstance,
  extend
};

export { vtkProgressHandler$1 as default, extend, newInstance };
