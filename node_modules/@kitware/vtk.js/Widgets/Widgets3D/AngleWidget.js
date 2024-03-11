import { m as macro } from '../../macros2.js';
import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import vtkPolyLineRepresentation from '../Representations/PolyLineRepresentation.js';
import vtkSphereHandleRepresentation from '../Representations/SphereHandleRepresentation.js';
import { s as subtract, V as angleBetweenVectors } from '../../Common/Core/Math/index.js';
import widgetBehavior from './AngleWidget/behavior.js';
import generateState from './AngleWidget/state.js';
import { ViewTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkAngleWidget(publicAPI, model) {
  model.classHierarchy.push('vtkAngleWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = ['activeScaleFactor', 'activeColor', 'useActiveColor', 'glyphResolution', 'defaultScale', 'scaleInPixels'];
  model._onManipulatorChanged = () => {
    model.widgetState.getMoveHandle().setManipulator(model.manipulator);
    model.widgetState.getHandleList().forEach(handle => {
      handle.setManipulator(model.manipulator);
    });
  };
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
          builder: vtkPolyLineRepresentation,
          labels: ['handles', 'moveHandle']
        }];
    }
  };

  // --- Public methods -------------------------------------------------------

  // Returns angle in radians
  publicAPI.getAngle = () => {
    const handles = model.widgetState.getHandleList();
    if (handles.length !== 3) {
      return 0;
    }
    if (!handles[0].getOrigin() || !handles[1].getOrigin() || !handles[2].getOrigin()) {
      return 0;
    }
    const vec1 = [0, 0, 0];
    const vec2 = [0, 0, 0];
    subtract(handles[0].getOrigin(), handles[1].getOrigin(), vec1);
    subtract(handles[2].getOrigin(), handles[1].getOrigin(), vec2);
    return angleBetweenVectors(vec1, vec2);
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
    useCameraNormal: true
  }));
}

// ----------------------------------------------------------------------------

const defaultValues = initialValues => ({
  // manipulator: null,
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
  vtkAngleWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkAngleWidget');

// ----------------------------------------------------------------------------

var vtkAngleWidget$1 = {
  newInstance,
  extend
};

export { vtkAngleWidget$1 as default, extend, newInstance };
