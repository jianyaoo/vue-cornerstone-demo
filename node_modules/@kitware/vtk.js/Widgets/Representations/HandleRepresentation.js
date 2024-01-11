import vtkWidgetRepresentation from './WidgetRepresentation.js';
import { Behavior } from './WidgetRepresentation/Constants.js';

// ----------------------------------------------------------------------------
// vtkHandleRepresentation methods
// ----------------------------------------------------------------------------

function vtkHandleRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkHandleRepresentation');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  behavior: Behavior.HANDLE,
  pickable: true,
  dragable: true,
  scaleInPixels: true
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const newDefault = {
    ...DEFAULT_VALUES,
    ...initialValues
  };
  vtkWidgetRepresentation.extend(publicAPI, model, newDefault);
  vtkHandleRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkHandleRepresentation$1 = {
  extend
};

export { vtkHandleRepresentation$1 as default, extend };
