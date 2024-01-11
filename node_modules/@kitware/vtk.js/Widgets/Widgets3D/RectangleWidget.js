import { m as macro } from '../../macros2.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import vtkShapeWidget from './ShapeWidget.js';
import vtkSphereHandleRepresentation from '../Representations/SphereHandleRepresentation.js';
import vtkRectangleContextRepresentation from '../Representations/RectangleContextRepresentation.js';
import widgetBehavior from './RectangleWidget/behavior.js';
import generateState from './RectangleWidget/state.js';
import { BehaviorCategory, ShapeBehavior } from './ShapeWidget/Constants.js';
import { ViewTypes } from '../Core/WidgetManager/Constants.js';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkRectangleWidget(publicAPI, model) {
  model.classHierarchy.push('vtkRectangleWidget');
  model.methodsToLink = [...model.methodsToLink, 'activeScaleFactor', 'activeColor', 'useActiveColor', 'drawBorder', 'drawFace', 'opacity'];

  // --- Widget Requirement ---------------------------------------------------

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
          builder: vtkRectangleContextRepresentation,
          labels: ['rectangleHandle']
        }];
    }
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  model.manipulator = vtkPlanePointManipulator.newInstance({
    useCameraNormal: true
  });
}

// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    behavior: widgetBehavior,
    widgetState: generateState(),
    modifierBehavior: {
      None: {
        [BehaviorCategory.PLACEMENT]: ShapeBehavior[BehaviorCategory.PLACEMENT].CLICK_AND_DRAG,
        [BehaviorCategory.POINTS]: ShapeBehavior[BehaviorCategory.POINTS].CORNER_TO_CORNER,
        [BehaviorCategory.RATIO]: ShapeBehavior[BehaviorCategory.RATIO].FREE
      },
      Shift: {
        [BehaviorCategory.RATIO]: ShapeBehavior[BehaviorCategory.RATIO].FIXED
      },
      Control: {
        [BehaviorCategory.POINTS]: ShapeBehavior[BehaviorCategory.POINTS].CENTER_TO_CORNER
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
  vtkRectangleWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkRectangleWidget');

// ----------------------------------------------------------------------------

var vtkRectangleWidget$1 = {
  newInstance,
  extend
};

export { vtkRectangleWidget$1 as default, extend, newInstance };
