import { m as macro } from '../../macros2.js';
import vtkPlane from '../../Common/DataModel/Plane.js';
import vtkAbstractManipulator from './AbstractManipulator.js';

function intersectDisplayWithPlane(x, y, planeOrigin, planeNormal, renderer, glRenderWindow) {
  const near = glRenderWindow.displayToWorld(x, y, 0, renderer);
  const far = glRenderWindow.displayToWorld(x, y, 1, renderer);
  return vtkPlane.intersectWithLine(near, far, planeOrigin, planeNormal).x;
}

// ----------------------------------------------------------------------------
// vtkPlaneManipulator methods
// ----------------------------------------------------------------------------

function vtkPlaneManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPlaneManipulator');
  publicAPI.handleEvent = (callData, glRenderWindow) => ({
    worldCoords: intersectDisplayWithPlane(callData.position.x, callData.position.y, publicAPI.getOrigin(callData), publicAPI.getNormal(callData), callData.pokedRenderer, glRenderWindow)
  });
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkAbstractManipulator.extend(publicAPI, model, defaultValues(initialValues));
  vtkPlaneManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPlaneManipulator');

// ----------------------------------------------------------------------------

var vtkPlanePointManipulator = {
  intersectDisplayWithPlane,
  extend,
  newInstance
};

export { vtkPlanePointManipulator as default, extend, intersectDisplayWithPlane, newInstance };
