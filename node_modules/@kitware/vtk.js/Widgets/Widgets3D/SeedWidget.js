import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import vtkCubeHandleRepresentation from '../Representations/CubeHandleRepresentation.js';
import { m as macro } from '../../macros2.js';
import widgetBehavior from './SeedWidget/behavior.js';
import stateGenerator from './SeedWidget/state.js';

function vtkSeedWidget(publicAPI, model) {
  model.classHierarchy.push('vtkSeedWidget');
  const superClass = {
    ...publicAPI
  };
  model.methodsToLink = ['scaleInPixels'];
  publicAPI.getRepresentationsForViewType = viewType => [{
    builder: vtkCubeHandleRepresentation,
    labels: ['moveHandle'],
    initialValues: {
      useActiveColor: false
    }
  }];
  publicAPI.setManipulator = manipulator => {
    superClass.setManipulator(manipulator);
    model.widgetState.getMoveHandle().setManipulator(manipulator);
  };
}
const defaultValues = initialValues => ({
  behavior: widgetBehavior,
  widgetState: stateGenerator(),
  ...initialValues
});
function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));
  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['manipulator', 'widgetState']);
  vtkSeedWidget(publicAPI, model);
}
const newInstance = macro.newInstance(extend, 'vtkSeedWidget');
var index = {
  newInstance,
  extend
};

export { index as default, extend, newInstance };
