import { m as macro } from '../../macros2.js';
import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import vtkSplineContextRepresentation from '../Representations/SplineContextRepresentation.js';
import vtkSphereHandleRepresentation from '../Representations/SphereHandleRepresentation.js';
import widgetBehavior from './SplineWidget/behavior.js';
import generateState from './SplineWidget/state.js';
import { ViewTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkSplineWidget(publicAPI, model) {
  model.classHierarchy.push('vtkSplineWidget');
  const superClass = {
    ...publicAPI
  };

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = ['boundaryCondition', 'close', 'outputBorder', 'fill', 'borderColor', 'errorBorderColor', 'scaleInPixels'];
  publicAPI.getRepresentationsForViewType = viewType => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
      case ViewTypes.VOLUME:
      default:
        return [{
          builder: vtkSphereHandleRepresentation,
          labels: ['handles', 'moveHandle']
        }, {
          builder: vtkSplineContextRepresentation,
          labels: ['handles', 'moveHandle']
        }];
    }
  };

  // --- Public methods -------------------------------------------------------
  publicAPI.setManipulator = manipulator => {
    superClass.setManipulator(manipulator);
    model.widgetState.getMoveHandle().setManipulator(manipulator);
    model.widgetState.getHandleList().forEach(handle => {
      handle.setManipulator(manipulator);
    });
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  // Default manipulator
  publicAPI.setManipulator(model.manipulator || model.manipulator || vtkPlanePointManipulator.newInstance({
    useCameraNormal: true
  }));
}

// ----------------------------------------------------------------------------

const defaultValues = initialValues => ({
  // manipulator: null,
  freehandMinDistance: 0.1,
  allowFreehand: true,
  resolution: 32,
  // propagates to SplineContextRepresentation
  defaultCursor: 'pointer',
  handleSizeInPixels: 10,
  // propagates to SplineContextRepresentation
  resetAfterPointPlacement: false,
  behavior: widgetBehavior,
  widgetState: generateState(),
  ...initialValues
});

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));
  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['manipulator', 'freehandMinDistance', 'allowFreehand', 'resolution', 'defaultCursor', 'handleSizeInPixels', 'resetAfterPointPlacement']);
  vtkSplineWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkSplineWidget');

// ----------------------------------------------------------------------------

var vtkSplineWidget$1 = {
  newInstance,
  extend
};

export { vtkSplineWidget$1 as default, extend, newInstance };
