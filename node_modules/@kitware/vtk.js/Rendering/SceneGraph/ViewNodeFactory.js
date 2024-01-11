import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkViewNodeFactory methods
// ----------------------------------------------------------------------------

function vtkViewNodeFactory(publicAPI, model) {
  // Make sure our overrides is just for our instance not shared with everyone...
  if (!model.overrides) {
    model.overrides = {};
  }

  // Set our className
  model.classHierarchy.push('vtkViewNodeFactory');
  publicAPI.createNode = dataObject => {
    if (dataObject.isDeleted()) {
      return null;
    }
    let cpt = 0;
    let className = dataObject.getClassName(cpt++);
    let isObject = false;
    const keys = Object.keys(model.overrides);
    while (className && !isObject) {
      if (keys.indexOf(className) !== -1) {
        isObject = true;
      } else {
        className = dataObject.getClassName(cpt++);
      }
    }
    if (!isObject) {
      return null;
    }
    const vn = model.overrides[className]();
    vn.setMyFactory(publicAPI);
    return vn;
  };
  publicAPI.registerOverride = (className, func) => {
    model.overrides[className] = func;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // overrides: {},
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);

  // Object methods
  vtkViewNodeFactory(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkViewNodeFactory');

// ----------------------------------------------------------------------------

var vtkViewNodeFactory$1 = {
  newInstance,
  extend
};

export { vtkViewNodeFactory$1 as default, extend, newInstance };
