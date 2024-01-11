import { m as macro } from '../../macros2.js';
import Constants from './SelectionNode/Constants.js';

// ----------------------------------------------------------------------------
// vtkSelectionNode methods
// ----------------------------------------------------------------------------

function vtkSelectionNode(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSelectionNode');
  publicAPI.getBounds = () => model.points.getBounds();
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  contentType: -1,
  fieldType: -1,
  properties: null,
  selectionList: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  macro.obj(publicAPI, model);
  model.properties = {};
  macro.setGet(publicAPI, model, ['contentType', 'fieldType', 'properties', 'selectionList']);

  // Object specific methods
  vtkSelectionNode(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSelectionNode');

// ----------------------------------------------------------------------------

var vtkSelectionNode$1 = {
  newInstance,
  extend,
  ...Constants
};

export { vtkSelectionNode$1 as default, extend, newInstance };
