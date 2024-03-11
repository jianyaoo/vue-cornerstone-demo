import { m as macro } from '../../macros2.js';
import vtkCellPicker from '../../Rendering/Core/CellPicker.js';
import vtkAbstractManipulator from './AbstractManipulator.js';

// ----------------------------------------------------------------------------
// vtkPickerManipulator methods
// ----------------------------------------------------------------------------

function vtkPickerManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPickerManipulator');
  publicAPI.handleEvent = callData => {
    const {
      position,
      pokedRenderer
    } = callData;
    model.picker.pick([position.x, position.y, 0.0], pokedRenderer);
    if (model.picker.getPickedPositions().length > 0) {
      model.position = model.picker.getPickedPositions()[0];
    } else {
      model.position = null;
    }
    return {
      worldCoords: model.position
    };
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  if (!initialValues.picker) {
    // Default picker
    const picker = vtkCellPicker.newInstance();
    picker.initializePickList();
    picker.setPickFromList(true);
    picker.setTolerance(0);
    initialValues.picker = picker;
  }
  return {
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkAbstractManipulator.extend(publicAPI, model, defaultValues(initialValues));
  macro.setGet(publicAPI, model, ['picker']);
  vtkPickerManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPickerManipulator');

// ----------------------------------------------------------------------------

var vtkPickerManipulator$1 = {
  extend,
  newInstance
};

export { vtkPickerManipulator$1 as default, extend, newInstance };
