import { m as macro } from '../../macros2.js';
import vtkCompositeVRManipulator from './CompositeVRManipulator.js';
import { Device, Input } from '../../Rendering/Core/RenderWindowInteractor/Constants.js';
import { States } from '../../Rendering/Core/InteractorStyle/Constants.js';

// ----------------------------------------------------------------------------
// vtkVRButtonPanManipulator methods
// ----------------------------------------------------------------------------

function vtkVRButtonPanManipulator(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkVRButtonPanManipulator');
  publicAPI.onButton3D = (interactorStyle, renderer, state, device, input, pressed) => {
    if (pressed) {
      interactorStyle.startCameraPose();
    } else if (state === States.IS_CAMERA_POSE) {
      interactorStyle.endCameraPose();
    }
  };
  publicAPI.onMove3D = (interactorStyle, renderer, state, data) => {
    if (state !== States.IS_CAMERA_POSE) {
      return;
    }

    // move the world in the direction of the
    // controller
    const camera = renderer.getActiveCamera();
    const oldTrans = camera.getPhysicalTranslation();

    // look at the y axis to determine how fast / what direction to move
    const speed = data.gamepad.axes[1];

    // 0.05 meters / frame movement
    const pscale = speed * 0.05 * camera.getPhysicalScale();

    // convert orientation to world coordinate direction
    const dir = camera.physicalOrientationToWorldDirection(data.orientation);
    camera.setPhysicalTranslation(oldTrans[0] + dir[0] * pscale, oldTrans[1] + dir[1] * pscale, oldTrans[2] + dir[2] * pscale);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  device: Device.RightController,
  input: Input.TrackPad
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.obj(publicAPI, model);
  vtkCompositeVRManipulator.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkVRButtonPanManipulator(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkVRButtonPanManipulator');

// ----------------------------------------------------------------------------

var vtkVRButtonPanManipulator$1 = {
  newInstance,
  extend
};

export { vtkVRButtonPanManipulator$1 as default, extend, newInstance };
