import { m as macro } from '../../macros2.js';
import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import vtkCircleContextRepresentation from '../Representations/CircleContextRepresentation.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import vtkSphereHandleRepresentation from '../Representations/SphereHandleRepresentation.js';
import widgetBehavior from './PaintWidget/behavior.js';
import generateState from './PaintWidget/state.js';
import { ViewTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkPaintWidget(publicAPI, model) {
  model.classHierarchy.push('vtkPaintWidget');
  const superClass = {
    ...publicAPI
  };

  // --- Widget Requirement ---------------------------------------------------

  publicAPI.getRepresentationsForViewType = viewType => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
        return [{
          builder: vtkCircleContextRepresentation,
          labels: ['handle', 'trail']
        }];
      case ViewTypes.VOLUME:
      default:
        return [{
          builder: vtkSphereHandleRepresentation,
          labels: ['handle']
        }];
    }
  };

  // --- Public methods -------------------------------------------------------

  publicAPI.setManipulator = manipulator => {
    superClass.setManipulator(manipulator);
    model.widgetState.getHandle().setManipulator(manipulator);
  };

  // override
  const superSetRadius = publicAPI.setRadius;
  publicAPI.setRadius = r => {
    if (superSetRadius(r)) {
      model.widgetState.getHandle().setScale1(r);
    }
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

const defaultValues = initialValues => ({
  // manipulator: null,
  radius: 1,
  painting: false,
  color: [1],
  behavior: widgetBehavior,
  widgetState: generateState(initialValues?.radius ?? 1),
  ...initialValues
});

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));
  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.get(publicAPI, model, ['painting']);
  macro.setGet(publicAPI, model, ['manipulator', 'radius', 'color']);
  vtkPaintWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPaintWidget');

// ----------------------------------------------------------------------------

var vtkPaintWidget$1 = {
  newInstance,
  extend
};

export { vtkPaintWidget$1 as default, extend, newInstance };
