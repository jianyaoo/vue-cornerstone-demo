import { m as macro } from '../../macros2.js';
import Constants from './ImageProperty/Constants.js';

const {
  InterpolationType
} = Constants;
const {
  vtkErrorMacro
} = macro;
const VTK_MAX_VRCOMP = 4;

// ----------------------------------------------------------------------------
// vtkImageProperty methods
// ----------------------------------------------------------------------------

function vtkImageProperty(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageProperty');
  publicAPI.getMTime = () => {
    let mTime = model.mtime;
    let time;
    for (let index = 0; index < VTK_MAX_VRCOMP; index++) {
      // Color MTimes
      if (model.componentData[index].rGBTransferFunction) {
        // time that RGB transfer function was last modified
        time = model.componentData[index].rGBTransferFunction.getMTime();
        mTime = mTime > time ? mTime : time;
      }

      // Piecewise function MTimes
      if (model.componentData[index].piecewiseFunction) {
        // time that weighting function was last modified
        time = model.componentData[index].piecewiseFunction.getMTime();
        mTime = mTime > time ? mTime : time;
      }
    }
    return mTime;
  };

  // Set the color of a volume to an RGB transfer function
  publicAPI.setRGBTransferFunction = function () {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    // backwards compatible call without the component index
    let idx = index;
    let transferFunc = func;
    if (!Number.isInteger(index)) {
      transferFunc = index;
      idx = 0;
    }
    if (model.componentData[idx].rGBTransferFunction !== transferFunc) {
      model.componentData[idx].rGBTransferFunction = transferFunc;
      publicAPI.modified();
      return true;
    }
    return false;
  };

  // Get the currently set RGB transfer function.
  publicAPI.getRGBTransferFunction = function () {
    let idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return model.componentData[idx].rGBTransferFunction;
  };

  // Set the piecewise function
  publicAPI.setPiecewiseFunction = function () {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let idx = index;
    let transferFunc = func;
    if (!Number.isInteger(index)) {
      transferFunc = index;
      idx = 0;
    }
    if (model.componentData[idx].piecewiseFunction !== transferFunc) {
      model.componentData[idx].piecewiseFunction = transferFunc;
      publicAPI.modified();
      return true;
    }
    return false;
  };

  // Get the component weighting function.
  publicAPI.getPiecewiseFunction = function () {
    let idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return model.componentData[idx].piecewiseFunction;
  };

  // Alias to set the piecewise function
  publicAPI.setScalarOpacity = function () {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    // backwards compatible call without the component index
    let idx = index;
    let transferFunc = func;
    if (!Number.isInteger(index)) {
      transferFunc = index;
      idx = 0;
    }
    return publicAPI.setPiecewiseFunction(idx, transferFunc);
  };

  // Alias to get the piecewise function (backwards compatibility)
  publicAPI.getScalarOpacity = function () {
    let idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return publicAPI.getPiecewiseFunction(idx);
  };
  publicAPI.setComponentWeight = function () {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    if (index < 0 || index >= VTK_MAX_VRCOMP) {
      vtkErrorMacro('Invalid index');
      return false;
    }
    const val = Math.min(1, Math.max(0, value));
    if (model.componentData[index].componentWeight !== val) {
      model.componentData[index].componentWeight = val;
      publicAPI.modified();
      return true;
    }
    return false;
  };
  publicAPI.getComponentWeight = function () {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    if (index < 0 || index >= VTK_MAX_VRCOMP) {
      vtkErrorMacro('Invalid index');
      return 0.0;
    }
    return model.componentData[index].componentWeight;
  };
  publicAPI.setInterpolationTypeToNearest = () => publicAPI.setInterpolationType(InterpolationType.NEAREST);
  publicAPI.setInterpolationTypeToLinear = () => publicAPI.setInterpolationType(InterpolationType.LINEAR);
  publicAPI.getInterpolationTypeAsString = () => macro.enumToString(InterpolationType, model.interpolationType);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {
  independentComponents: false,
  interpolationType: InterpolationType.LINEAR,
  colorWindow: 255,
  colorLevel: 127.5,
  ambient: 1.0,
  diffuse: 0.0,
  opacity: 1.0,
  useLookupTableScalarRange: false,
  useLabelOutline: false,
  labelOutlineThickness: [1],
  labelOutlineOpacity: 1.0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  if (!model.componentData) {
    model.componentData = [];
    for (let i = 0; i < VTK_MAX_VRCOMP; i++) {
      model.componentData.push({
        rGBTransferFunction: null,
        piecewiseFunction: null,
        componentWeight: 1.0
      });
    }
  }
  macro.setGet(publicAPI, model, ['independentComponents', 'interpolationType', 'colorWindow', 'colorLevel', 'ambient', 'diffuse', 'opacity', 'useLookupTableScalarRange', 'useLabelOutline', 'labelOutlineOpacity']);
  macro.setGetArray(publicAPI, model, ['labelOutlineThickness']);

  // Object methods
  vtkImageProperty(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkImageProperty');

// ----------------------------------------------------------------------------

var vtkImageProperty$1 = {
  newInstance,
  extend
};

export { vtkImageProperty$1 as default, extend, newInstance };
