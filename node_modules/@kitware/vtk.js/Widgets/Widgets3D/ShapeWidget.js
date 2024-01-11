import { m as macro } from '../../macros2.js';
import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import { BehaviorCategory, ShapeBehavior } from './ShapeWidget/Constants.js';

function vtkShapeWidget(publicAPI, model) {
  model.classHierarchy.push('vtkShapeWidget');
  const superClass = {
    ...publicAPI
  };
  model.methodsToLink = ['scaleInPixels'];
  publicAPI.setManipulator = manipulator => {
    superClass.setManipulator(manipulator);
    model.widgetState.getStatesWithLabel('moveHandle').forEach(handle => handle.setManipulator(manipulator));
  };
}
function defaultValues(initialValues) {
  return {
    // manipulator: null,
    modifierBehavior: {
      None: {
        [BehaviorCategory.PLACEMENT]: ShapeBehavior[BehaviorCategory.PLACEMENT].CLICK_AND_DRAG,
        [BehaviorCategory.POINTS]: ShapeBehavior[BehaviorCategory.POINTS].CORNER_TO_CORNER,
        [BehaviorCategory.RATIO]: ShapeBehavior[BehaviorCategory.RATIO].FREE
      }
    },
    resetAfterPointPlacement: false,
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));
  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['manipulator', 'modifierBehavior', 'resetAfterPointPlacement']);
  vtkShapeWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkShapeWidget');
var vtkShapeWidget$1 = {
  newInstance,
  extend
};

export { vtkShapeWidget$1 as default, extend, newInstance };
