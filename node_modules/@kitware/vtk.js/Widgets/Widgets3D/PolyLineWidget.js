import { m as macro } from '../../macros2.js';
import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import vtkPolyLineRepresentation from '../Representations/PolyLineRepresentation.js';
import vtkSphereHandleRepresentation from '../Representations/SphereHandleRepresentation.js';
import widgetBehavior from './PolyLineWidget/behavior.js';
import generateState from './PolyLineWidget/state.js';
import { ViewTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkPolyLineWidget(publicAPI, model) {
  model.classHierarchy.push('vtkPolyLineWidget');
  const superClass = {
    ...publicAPI
  };

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = ['activeColor', 'activeScaleFactor', 'closePolyLine', 'defaultScale', 'glyphResolution', 'lineThickness', 'useActiveColor', 'scaleInPixels'];
  publicAPI.getRepresentationsForViewType = viewType => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
      case ViewTypes.VOLUME:
      default:
        return [{
          builder: vtkSphereHandleRepresentation,
          labels: ['handles']
        }, {
          builder: vtkSphereHandleRepresentation,
          labels: ['moveHandle']
        }, {
          builder: vtkPolyLineRepresentation,
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

  model.widgetState.onBoundsChange(bounds => {
    const center = [(bounds[0] + bounds[1]) * 0.5, (bounds[2] + bounds[3]) * 0.5, (bounds[4] + bounds[5]) * 0.5];
    model.widgetState.getMoveHandle().setOrigin(center);
  });

  // Default manipulator
  publicAPI.setManipulator(model.manipulator || vtkPlanePointManipulator.newInstance({
    useCameraFocalPoint: true,
    useCameraNormal: true
  }));
}

// ----------------------------------------------------------------------------

const defaultValues = initialValues => ({
  manipulator: null,
  behavior: widgetBehavior,
  widgetState: generateState(),
  ...initialValues
});

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));
  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['manipulator']);
  vtkPolyLineWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPolyLineWidget');

// ----------------------------------------------------------------------------

var vtkPolyLineWidget$1 = {
  newInstance,
  extend
};

export { vtkPolyLineWidget$1 as default, extend, newInstance };
