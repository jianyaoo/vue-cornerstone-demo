import { m as macro } from '../../macros2.js';
import vtkCircleContextRepresentation from '../Representations/CircleContextRepresentation.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import vtkShapeWidget from './ShapeWidget.js';
import vtkSphereHandleRepresentation from '../Representations/SphereHandleRepresentation.js';
import widgetBehavior from './EllipseWidget/behavior.js';
import generateState from './EllipseWidget/state.js';
import { BehaviorCategory, ShapeBehavior } from './ShapeWidget/Constants.js';
import { ViewTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkEllipseWidget(publicAPI, model) {
  model.classHierarchy.push('vtkEllipseWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = [...model.methodsToLink, 'activeScaleFactor', 'activeColor', 'useActiveColor', 'glyphResolution', 'defaultScale', 'drawBorder', 'drawFace', 'opacity'];
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
        }, {
          builder: vtkCircleContextRepresentation,
          labels: ['ellipseHandle']
        }];
    }
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  publicAPI.setManipulator(model.manipulator || vtkPlanePointManipulator.newInstance({
    useCameraNormal: true
  }));
}

// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    behavior: widgetBehavior,
    widgetState: generateState(),
    modifierBehavior: {
      None: {
        [BehaviorCategory.PLACEMENT]: ShapeBehavior[BehaviorCategory.PLACEMENT].CLICK_AND_DRAG,
        [BehaviorCategory.POINTS]: ShapeBehavior[BehaviorCategory.POINTS].CENTER_TO_CORNER,
        [BehaviorCategory.RATIO]: ShapeBehavior[BehaviorCategory.RATIO].FREE
      },
      Shift: {
        [BehaviorCategory.RATIO]: ShapeBehavior[BehaviorCategory.RATIO].FIXED
      },
      Control: {
        [BehaviorCategory.POINTS]: ShapeBehavior[BehaviorCategory.POINTS].CORNER_TO_CORNER
      }
    },
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkShapeWidget.extend(publicAPI, model, defaultValues(initialValues));
  macro.setGet(publicAPI, model, ['widgetState']);
  vtkEllipseWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkEllipseWidget');

// ----------------------------------------------------------------------------

var vtkEllipseWidget$1 = {
  newInstance,
  extend
};

export { vtkEllipseWidget$1 as default, extend, newInstance };
