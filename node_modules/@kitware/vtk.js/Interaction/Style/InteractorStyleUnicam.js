import { m as macro } from '../../macros2.js';
import vtkInteractorStyleManipulator from './InteractorStyleManipulator.js';
import vtkMouseCameraUnicamManipulator from '../Manipulators/MouseCameraUnicamManipulator.js';

// ----------------------------------------------------------------------------
// vtkInteractorStyleUnicam methods
// ----------------------------------------------------------------------------

function vtkInteractorStyleUnicam(publicAPI, model) {
  model.classHierarchy.push('vtkInteractorStyleUnicam');
  model.unicamManipulator = vtkMouseCameraUnicamManipulator.newInstance({
    button: 1
  });
  publicAPI.addMouseManipulator(model.unicamManipulator);
  publicAPI.getUseWorldUpVec = () => model.unicamManipulator.getUseWorldUpVec();
  publicAPI.setUseWorldUpVec = useWorldUpVec => {
    model.unicamManipulator.setUseWorldUpVec(useWorldUpVec);
  };
  publicAPI.getWorldUpVec = () => model.unicamManipulator.getWorldUpVec();
  publicAPI.setWorldUpVec = (x, y, z) => {
    model.unicamManipulator.setWorldUpVec(x, y, z);
  };
  publicAPI.getUseHardwareSelector = () => model.unicamManipulator.getUseHardwareSelector();
  publicAPI.setUseHardwareSelector = useHardwareSelector => {
    model.unicamManipulator.setUseHardwareSelector(useHardwareSelector);
  };
  publicAPI.getFocusSphereColor = () => {
    model.unicamManipulator.getFocusSphereColor();
  };
  publicAPI.setFocusSphereColor = (r, g, b) => {
    model.unicamManipulator.setFocusSphereColor(r, g, b);
  };
  publicAPI.getFocusSphereRadiusFactor = () => model.unicamManipulator.getFocusSphereRadiusFactor();
  publicAPI.setFocusSphereRadiusFactor = focusSphereRadiusFactor => {
    model.unicamManipulator.setFocusSphereRadiusFactor(focusSphereRadiusFactor);
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
  vtkInteractorStyleManipulator.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkInteractorStyleUnicam(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkInteractorStyleUnicam');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

export { index as default, extend, newInstance };
