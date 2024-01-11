import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkPriorityQueue methods
// ----------------------------------------------------------------------------

function vtkPriorityQueue(publicAPI, model) {
  // Set our classname
  model.classHierarchy.push('vtkPriorityQueue');
  publicAPI.push = (priority, element) => {
    // naive algo
    const i = model.elements.findIndex(e => e.priority > priority);
    model.elements.splice(i, 0, {
      priority,
      element
    });
  };
  publicAPI.pop = () => {
    if (model.elements.length > 0) {
      return model.elements.shift().element;
    }
    return null;
  };
  publicAPI.deleteById = id => {
    model.elements = model.elements.filter(_ref => {
      let {
        element
      } = _ref;
      return element.id !== id;
    });
  };
  publicAPI.length = () => model.elements.length;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  elements: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  vtkPriorityQueue(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPriorityQueue');

// ----------------------------------------------------------------------------

var vtkPriorityQueue$1 = {
  newInstance,
  extend
};

export { vtkPriorityQueue$1 as default, extend, newInstance };
