import { m as macro } from '../../macros2.js';
import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import vtkSphereHandleRepresentation from '../Representations/SphereHandleRepresentation.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import widgetBehavior from './LabelWidget/behavior.js';
import generateState from './LabelWidget/state.js';
import { ViewTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkLabelWidget(publicAPI, model) {
  model.classHierarchy.push('vtkLabelWidget');
  const superClass = {
    ...publicAPI
  };

  // --- Widget Requirement ---------------------------------------------------
  model.methodsToLink = ['scaleInPixels'];
  publicAPI.getRepresentationsForViewType = viewType => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
      case ViewTypes.VOLUME:
      default:
        return [{
          builder: vtkSphereHandleRepresentation,
          labels: ['moveHandle']
        }];
    }
  };

  // --- Public methods -------------------------------------------------------

  publicAPI.setManipulator = manipulator => {
    superClass.setManipulator(manipulator);
    model.widgetState.getMoveHandle().setManipulator(manipulator);
    model.widgetState.getText().setManipulator(manipulator);
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  // Default manipulator
  publicAPI.setManipulator(model.manipulator || vtkPlanePointManipulator.newInstance({
    useCameraNormal: true
  }));
}

// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    behavior: widgetBehavior,
    widgetState: generateState(),
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));
  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['manipulator']);
  vtkLabelWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkLabelWidget');

// ----------------------------------------------------------------------------

var vtkLabelWidget$1 = {
  newInstance,
  extend
};

export { vtkLabelWidget$1 as default, extend, newInstance };
