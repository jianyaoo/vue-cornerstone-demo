import { mat4, vec3 } from 'gl-matrix';
import { m as macro } from '../../macros2.js';
import { j as cross, r as radiansFromDegrees } from '../../Common/Core/Math/index.js';
import vtkAbstractManipulator from './AbstractManipulator.js';

function trackballRotate(prevX, prevY, curX, curY, origin, direction, renderer, glRenderWindow) {
  const dx = curX - prevX;
  const dy = curY - prevY;
  const camera = renderer.getActiveCamera();
  const viewUp = camera.getViewUp();
  const dop = camera.getDirectionOfProjection();
  const size = renderer.getRenderWindow().getInteractor().getView().getViewportSize(renderer);
  const xdeg = 360.0 * dx / size[0];
  const ydeg = 360.0 * dy / size[1];
  const newDirection = new Float64Array([direction[0], direction[1], direction[2]]);
  const xDisplayAxis = viewUp;
  const yDisplayAxis = [0, 0, 0];
  cross(dop, viewUp, yDisplayAxis);
  const rot = mat4.identity(new Float64Array(16));
  mat4.rotate(rot, rot, radiansFromDegrees(xdeg), xDisplayAxis);
  mat4.rotate(rot, rot, radiansFromDegrees(-ydeg), yDisplayAxis);
  vec3.transformMat4(newDirection, newDirection, rot);
  return newDirection;
}

// ----------------------------------------------------------------------------
// vtkTrackballManipulator methods
// ----------------------------------------------------------------------------

function vtkTrackballManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkTrackballManipulator');
  let prevX = 0;
  let prevY = 0;
  publicAPI.handleEvent = (callData, glRenderWindow) => {
    const newDirection = trackballRotate(prevX, prevY, callData.position.x, callData.position.y, publicAPI.getOrigin(callData), publicAPI.getNormal(callData), callData.pokedRenderer);
    prevX = callData.position.x;
    prevY = callData.position.y;
    return {
      worldCoords: newDirection
    };
  };
  publicAPI.reset = callData => {
    prevX = callData.position.x;
    prevY = callData.position.y;
  };
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
  vtkTrackballManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkTrackballManipulator');

// ----------------------------------------------------------------------------

var vtkTrackballManipulator$1 = {
  trackballRotate,
  extend,
  newInstance
};

export { vtkTrackballManipulator$1 as default, extend, newInstance, trackballRotate };
