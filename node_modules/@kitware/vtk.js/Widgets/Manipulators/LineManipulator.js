import { m as macro } from '../../macros2.js';
import { d as dot, s as subtract, j as cross, w as multiplyScalar, k as add } from '../../Common/Core/Math/index.js';
import vtkAbstractManipulator from './AbstractManipulator.js';
import { EPSILON } from '../../Common/Core/Math/Constants.js';

function projectDisplayToLine(x, y, lineOrigin, lineDirection, renderer, glRenderWindow) {
  // if the active camera viewPlaneNormal and line direction are parallel, no change is allowed
  const dotProduct = Math.abs(dot(renderer.getActiveCamera().getViewPlaneNormal(), lineDirection));
  if (1 - dotProduct < EPSILON) {
    return [];
  }
  const near = glRenderWindow.displayToWorld(x, y, 0, renderer);
  const far = glRenderWindow.displayToWorld(x, y, 1, renderer);
  const viewDir = [0, 0, 0];
  subtract(far, near, viewDir);
  const normal = [0, 0, 0];
  cross(lineDirection, viewDir, normal);
  cross(normal, viewDir, normal);
  const numerator = dot([near[0] - lineOrigin[0], near[1] - lineOrigin[1], near[2] - lineOrigin[2]], normal);
  const denominator = dot(normal, lineDirection);
  const result = lineDirection.slice();
  if (denominator === 0) {
    // no change is allowed
    multiplyScalar(result, 0);
  } else {
    multiplyScalar(result, numerator / denominator);
  }
  add(lineOrigin, result, result);
  return result;
}

// ----------------------------------------------------------------------------
// vtkLineManipulator methods
// ----------------------------------------------------------------------------

function vtkLineManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLineManipulator');
  publicAPI.handleEvent = (callData, glRenderWindow) => ({
    worldCoords: projectDisplayToLine(callData.position.x, callData.position.y, publicAPI.getOrigin(callData), publicAPI.getNormal(callData), callData.pokedRenderer, glRenderWindow)
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
  vtkLineManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkLineManipulator');

// ----------------------------------------------------------------------------

var vtkLineManipulator$1 = {
  projectDisplayToLine,
  extend,
  newInstance
};

export { vtkLineManipulator$1 as default, extend, newInstance, projectDisplayToLine };
