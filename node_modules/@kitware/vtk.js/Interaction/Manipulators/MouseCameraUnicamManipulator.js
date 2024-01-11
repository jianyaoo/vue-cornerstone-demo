import vtkCompositeCameraManipulator from './CompositeCameraManipulator.js';
import vtkCompositeMouseManipulator from './CompositeMouseManipulator.js';
import vtkInteractorStyleConstants from '../../Rendering/Core/InteractorStyle/Constants.js';
import vtkMouseCameraUnicamRotateManipulator from './MouseCameraUnicamRotateManipulator.js';
import { m as macro } from '../../macros2.js';
import { s as subtract, w as multiplyScalar, l as normalize, d as dot, r as radiansFromDegrees, j as cross } from '../../Common/Core/Math/index.js';

const {
  States
} = vtkInteractorStyleConstants;

// ----------------------------------------------------------------------------
// vtkMouseCameraUnicamManipulator methods
// ----------------------------------------------------------------------------

function vtkMouseCameraUnicamManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkMouseCameraUnicamManipulator');
  model.state = States.IS_NONE;
  model.rotateManipulator = vtkMouseCameraUnicamRotateManipulator.newInstance({
    button: model.button,
    shift: model.shift,
    control: model.control,
    alt: model.alt,
    dragEnabled: model.dragEnabled,
    scrollEnabled: model.scrollEnabled,
    displayFocusSphereOnButtonDown: false
  });

  //----------------------------------------------------------------------------
  const normalize$1 = (position, interactor) => {
    const renderer = interactor.findPokedRenderer();
    const [width, height] = interactor.getView().getViewportSize(renderer);
    const nx = -1.0 + 2.0 * position.x / width;
    const ny = -1.0 + 2.0 * position.y / height;
    return {
      x: nx,
      y: ny
    };
  };

  // Given a 3D point & a vtkCamera, compute the vectors that extend
  // from the projection of the center of projection to the center of
  // the right-edge and the center of the top-edge onto the plane
  // containing the 3D point & with normal parallel to the camera's
  // projection plane.
  const getRightVAndUpV = (downPoint, interactor) => {
    // Compute the horizontal & vertical scaling ('scalex' and 'scaley')
    // factors as function of the down point & camera params.
    const camera = interactor.findPokedRenderer().getActiveCamera();
    const cameraPosition = camera.getPosition();
    const cameraToPointVec = [0, 0, 0];

    // Construct a vector from the viewing position to the picked point
    subtract(downPoint, cameraPosition, cameraToPointVec);
    if (camera.getParallelProjection()) {
      multiplyScalar(cameraToPointVec, camera.getParallelScale());
    }

    // Get shortest distance 'l' between the viewing position and
    // plane parallel to the projection plane that contains the 'downPoint'.
    const atV = camera.getViewPlaneNormal();
    normalize(atV);
    const l = dot(cameraToPointVec, atV);
    const viewAngle = radiansFromDegrees(camera.getViewAngle());
    const renderer = interactor.findPokedRenderer();
    const [width, height] = interactor.getView().getViewportSize(renderer);
    const scaleX = width / height * (2 * l * Math.tan(viewAngle / 2) / 2);
    const scaleY = 2 * l * Math.tan(viewAngle / 2) / 2;

    // Construct the camera offset vector as function of delta mouse X & Y.
    const upV = camera.getViewUp();
    const rightV = [];
    cross(upV, atV, rightV);
    // (Make sure 'upV' is orthogonal to 'atV' & 'rightV')
    cross(atV, rightV, upV);
    normalize(rightV);
    normalize(upV);
    multiplyScalar(rightV, scaleX);
    multiplyScalar(upV, scaleY);
    return {
      rightV,
      upV
    };
  };

  //----------------------------------------------------------------------------
  const choose = (interactor, position) => {
    const normalizedPosition = normalize$1(position, interactor);
    const normalizedPreviousPosition = normalize$1(model.previousPosition, interactor);
    const delta = {
      x: normalizedPosition.x - normalizedPreviousPosition.x,
      y: normalizedPosition.y - normalizedPreviousPosition.y
    };
    model.previousPosition = position;
    const deltaT = Date.now() / 1000 - model.time;
    model.dist += Math.sqrt(delta.x ** 2 + delta.y ** 2);
    const sDelta = {
      x: position.x - model.startPosition.x,
      y: position.y - model.startPosition.y
    };
    const len = Math.sqrt(sDelta.x ** 2 + sDelta.y ** 2);
    if (Math.abs(sDelta.y) / len > 0.9 && deltaT > 0.05) {
      model.state = States.IS_DOLLY;
    } else if (deltaT >= 0.1 || model.dist >= 0.03) {
      if (Math.abs(sDelta.x) / len > 0.6) {
        model.state = States.IS_PAN;
      } else {
        model.state = States.IS_DOLLY;
      }
    }
  };

  //----------------------------------------------------------------------------
  // Transform mouse horizontal & vertical movements to a world
  // space offset for the camera that maintains pick correlation.
  const pan = (interactor, position) => {
    const renderer = interactor.findPokedRenderer();
    const normalizedPosition = normalize$1(position, interactor);
    const normalizedPreviousPosition = normalize$1(model.previousPosition, interactor);
    const delta = {
      x: normalizedPosition.x - normalizedPreviousPosition.x,
      y: normalizedPosition.y - normalizedPreviousPosition.y
    };
    const camera = renderer.getActiveCamera();
    model.previousPosition = position;
    const {
      rightV,
      upV
    } = getRightVAndUpV(model.downPoint, interactor);
    const offset = [];
    for (let index = 0; index < 3; index++) {
      offset[index] = delta.x * rightV[index] + delta.y * upV[index];
    }
    camera.translate(...offset);
    renderer.resetCameraClippingRange();
    interactor.render();
  };

  //----------------------------------------------------------------------------
  const dolly = (interactor, position) => {
    const renderer = interactor.findPokedRenderer();
    const normalizedPosition = normalize$1(position, interactor);
    const normalizedPreviousPosition = normalize$1(model.previousPosition, interactor);
    const delta = {
      x: normalizedPosition.x - normalizedPreviousPosition.x,
      y: normalizedPosition.y - normalizedPreviousPosition.y
    };
    const camera = renderer.getActiveCamera();
    const cameraPosition = camera.getPosition();

    // 1. Handle dollying
    if (camera.getParallelProjection()) {
      camera.zoom(1 - delta.y);
    } else {
      const offset1 = [];
      subtract(model.downPoint, cameraPosition, offset1);
      multiplyScalar(offset1, delta.y * -4);
      camera.translate(...offset1);
    }

    // 2. Now handle side-to-side panning
    const {
      rightV: offset2
    } = getRightVAndUpV(model.downPoint, interactor);
    multiplyScalar(offset2, delta.x);
    camera.translate(...offset2);
    renderer.resetCameraClippingRange();
    interactor.render();
  };

  //----------------------------------------------------------------------------
  // Public API methods
  //----------------------------------------------------------------------------
  publicAPI.onButtonDown = (interactor, renderer, position) => {
    model.buttonPressed = true;
    model.startPosition = position;
    model.previousPosition = position;
    model.time = Date.now() / 1000.0;
    model.dist = 0;

    // Picking is delegated to the rotate manipulator
    model.rotateManipulator.onButtonDown(interactor, renderer, position);
    model.downPoint = model.rotateManipulator.getDownPoint();
  };

  //----------------------------------------------------------------------------
  publicAPI.onMouseMove = (interactor, renderer, position) => {
    if (!model.buttonPressed) {
      return;
    }
    if (model.rotateManipulator.getState() === States.IS_ROTATE) {
      model.rotateManipulator.onMouseMove(interactor, renderer, position);
    } else {
      switch (model.state) {
        case States.IS_NONE:
          choose(interactor, position);
          break;
        case States.IS_PAN:
          pan(interactor, position);
          break;
        case States.IS_DOLLY:
          dolly(interactor, position);
          break;
      }
    }
    model.previousPosition = position;
  };

  //--------------------------------------------------------------------------
  publicAPI.onButtonUp = interactor => {
    model.buttonPressed = false;
    if (model.state === States.IS_NONE) {
      model.rotateManipulator.onButtonUp(interactor);
    }
    model.state = States.IS_NONE;
  };
  publicAPI.getUseWorldUpVec = () => model.rotateManipulator.getUseWorldUpVec();
  publicAPI.setUseWorldUpVec = useWorldUpVec => {
    model.rotateManipulator.setUseWorldUpVec(useWorldUpVec);
  };
  publicAPI.getWorldUpVec = () => model.rotateManipulator.getWorldUpVec();
  publicAPI.setWorldUpVec = (x, y, z) => {
    model.rotateManipulator.setWorldUpVec(x, y, z);
  };
  publicAPI.getUseHardwareSelector = () => model.rotateManipulator.getUseHardwareSelector();
  publicAPI.setUseHardwareSelector = useHardwareSelector => {
    model.rotateManipulator.setUseHardwareSelector(useHardwareSelector);
  };
  publicAPI.getFocusSphereColor = () => {
    model.rotateManipulator.getFocusSphereColor();
  };
  publicAPI.setFocusSphereColor = (r, g, b) => {
    model.rotateManipulator.setFocusSphereColor(r, g, b);
  };
  publicAPI.getFocusSphereRadiusFactor = () => model.rotateManipulator.getFocusSphereRadiusFactor();
  publicAPI.setFocusSphereRadiusFactor = focusSphereRadiusFactor => {
    model.rotateManipulator.setFocusSphereRadiusFactor(focusSphereRadiusFactor);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  macro.obj(publicAPI, model);
  vtkCompositeCameraManipulator.extend(publicAPI, model, initialValues);
  vtkCompositeMouseManipulator.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkMouseCameraUnicamManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkMouseCameraUnicamManipulator');

// ----------------------------------------------------------------------------

var vtkMouseCameraUnicamManipulator$1 = {
  newInstance,
  extend
};

export { vtkMouseCameraUnicamManipulator$1 as default, extend, newInstance };
