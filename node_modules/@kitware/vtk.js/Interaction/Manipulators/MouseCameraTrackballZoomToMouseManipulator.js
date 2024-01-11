import { m as macro } from '../../macros2.js';
import vtkInteractorStyleManipulator from '../Style/InteractorStyleManipulator.js';
import vtkMouseCameraTrackballZoomManipulator from './MouseCameraTrackballZoomManipulator.js';

// ----------------------------------------------------------------------------
// vtkMouseCameraTrackballZoomToMouseManipulator methods
// ----------------------------------------------------------------------------

function vtkMouseCameraTrackballZoomToMouseManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkMouseCameraTrackballZoomToMouseManipulator');
  const superOnButtonDown = publicAPI.onButtonDown;
  publicAPI.onButtonDown = (interactor, renderer, position) => {
    superOnButtonDown(interactor, renderer, position);
    model.zoomPosition = position;
  };
  publicAPI.onMouseMove = (interactor, renderer, position) => {
    if (!position) {
      return;
    }
    const dy = model.previousPosition.y - position.y;
    const k = dy * model.zoomScale;
    vtkInteractorStyleManipulator.dollyToPosition(1.0 - k, model.zoomPosition, renderer, interactor);
    if (interactor.getLightFollowCamera()) {
      renderer.updateLightsGeometryToFollowCamera();
    }
    model.previousPosition = position;
  };
  publicAPI.onScroll = (interactor, renderer, delta, position) => {
    if (!delta || !position) {
      return;
    }
    const dyf = 1 - delta * 0.1;
    vtkInteractorStyleManipulator.dollyToPosition(dyf, position, renderer, interactor);
    if (interactor.getLightFollowCamera()) {
      renderer.updateLightsGeometryToFollowCamera();
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  zoomPosition: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkMouseCameraTrackballZoomManipulator.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkMouseCameraTrackballZoomToMouseManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkMouseCameraTrackballZoomToMouseManipulator');

// ----------------------------------------------------------------------------

var vtkMouseCameraTrackballZoomToMouseManipulator$1 = {
  newInstance,
  extend
};

export { vtkMouseCameraTrackballZoomToMouseManipulator$1 as default, extend, newInstance };
