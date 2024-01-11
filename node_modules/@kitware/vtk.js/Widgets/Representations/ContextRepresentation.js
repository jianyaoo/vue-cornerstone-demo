import vtkWidgetRepresentation from './WidgetRepresentation.js';
import { Behavior } from './WidgetRepresentation/Constants.js';

// ----------------------------------------------------------------------------
// vtkWidgetRepresentation
// ----------------------------------------------------------------------------

function vtkContextRepresentation(publicAPI, model) {
  model.classHierarchy.push('vtkContextRepresentation');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  behavior: Behavior.CONTEXT,
  pickable: false,
  dragable: true
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const newDefault = {
    ...DEFAULT_VALUES,
    ...initialValues
  };
  vtkWidgetRepresentation.extend(publicAPI, model, newDefault);
  vtkContextRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkContextRepresentation$1 = {
  extend
};

export { vtkContextRepresentation$1 as default, extend };
