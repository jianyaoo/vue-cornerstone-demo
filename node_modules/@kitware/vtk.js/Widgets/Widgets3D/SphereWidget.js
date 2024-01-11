import { e as distance2BetweenPoints } from '../../Common/Core/Math/index.js';
import vtkAbstractWidgetFactory from '../Core/AbstractWidgetFactory.js';
import vtkPlanePointManipulator from '../Manipulators/PlaneManipulator.js';
import vtkSphereHandleRepresentation from '../Representations/SphereHandleRepresentation.js';
import vtkSphereContextRepresentation from '../Representations/SphereContextRepresentation.js';
import { m as macro } from '../../macros2.js';
import widgetBehavior from './SphereWidget/behavior.js';
import stateGenerator from './SphereWidget/state.js';

function vtkSphereWidget(publicAPI, model) {
  model.classHierarchy.push('vtkSphereWidget');
  const superClass = {
    ...publicAPI
  };
  model.methodsToLink = ['scaleInPixels'];
  publicAPI.getRepresentationsForViewType = viewType => [{
    builder: vtkSphereHandleRepresentation,
    labels: ['moveHandle']
  }, {
    builder: vtkSphereHandleRepresentation,
    labels: ['centerHandle']
  }, {
    builder: vtkSphereHandleRepresentation,
    labels: ['borderHandle']
  }, {
    builder: vtkSphereContextRepresentation,
    labels: ['sphereHandle']
  }];

  // --- Public methods -------------------------------------------------------

  publicAPI.getRadius = () => {
    const h1 = model.widgetState.getCenterHandle();
    const h2 = model.widgetState.getBorderHandle();
    return Math.sqrt(distance2BetweenPoints(h1.getOrigin(), h2.getOrigin()));
  };
  publicAPI.setManipulator = manipulator => {
    superClass.setManipulator(manipulator);
    model.widgetState.getMoveHandle().setManipulator(manipulator);
    model.widgetState.getCenterHandle().setManipulator(manipulator);
    model.widgetState.getBorderHandle().setManipulator(manipulator);
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  publicAPI.setManipulator(model.manipulator || vtkPlanePointManipulator.newInstance({
    useCameraNormal: true
  }));
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
  vtkSphereWidget(publicAPI, model);
}
const newInstance = macro.newInstance(extend, 'vtkSphereWidget');
var vtkSphereWidget$1 = {
  newInstance,
  extend
};

export { vtkSphereWidget$1 as default, extend, newInstance };
