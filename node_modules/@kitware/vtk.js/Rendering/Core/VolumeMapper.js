import { m as macro } from '../../macros2.js';
import { F as createUninitializedBounds, C as clampValue, J as floor } from '../../Common/Core/Math/index.js';
import Constants from './VolumeMapper/Constants.js';
import vtkAbstractMapper from './AbstractMapper.js';
import vtkPiecewiseFunction from '../../Common/DataModel/PiecewiseFunction.js';

const {
  BlendMode,
  FilterMode
} = Constants;
function createRadonTransferFunction(firstAbsorbentMaterialHounsfieldValue, firstAbsorbentMaterialAbsorption, maxAbsorbentMaterialHounsfieldValue, maxAbsorbentMaterialAbsorption, outputTransferFunction) {
  let ofun = null;
  if (outputTransferFunction) {
    ofun = outputTransferFunction;
    ofun.removeAllPoints();
  } else {
    ofun = vtkPiecewiseFunction.newInstance();
  }
  ofun.addPointLong(-1024, 0, 1, 1); // air (i.e. material with no absorption)
  ofun.addPoint(firstAbsorbentMaterialHounsfieldValue, firstAbsorbentMaterialAbsorption);
  ofun.addPoint(maxAbsorbentMaterialHounsfieldValue, maxAbsorbentMaterialAbsorption);
  return ofun;
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

const STATIC = {
  createRadonTransferFunction
};

// ----------------------------------------------------------------------------
// vtkVolumeMapper methods
// ----------------------------------------------------------------------------

function vtkVolumeMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkVolumeMapper');
  const superClass = {
    ...publicAPI
  };
  publicAPI.getBounds = () => {
    const input = publicAPI.getInputData();
    if (!input) {
      model.bounds = createUninitializedBounds();
    } else {
      if (!model.static) {
        publicAPI.update();
      }
      model.bounds = input.getBounds();
    }
    return model.bounds;
  };
  publicAPI.update = () => {
    publicAPI.getInputData();
  };
  publicAPI.setBlendModeToComposite = () => {
    publicAPI.setBlendMode(BlendMode.COMPOSITE_BLEND);
  };
  publicAPI.setBlendModeToMaximumIntensity = () => {
    publicAPI.setBlendMode(BlendMode.MAXIMUM_INTENSITY_BLEND);
  };
  publicAPI.setBlendModeToMinimumIntensity = () => {
    publicAPI.setBlendMode(BlendMode.MINIMUM_INTENSITY_BLEND);
  };
  publicAPI.setBlendModeToAverageIntensity = () => {
    publicAPI.setBlendMode(BlendMode.AVERAGE_INTENSITY_BLEND);
  };
  publicAPI.setBlendModeToAdditiveIntensity = () => {
    publicAPI.setBlendMode(BlendMode.ADDITIVE_INTENSITY_BLEND);
  };
  publicAPI.setBlendModeToRadonTransform = () => {
    publicAPI.setBlendMode(BlendMode.RADON_TRANSFORM_BLEND);
  };
  publicAPI.getBlendModeAsString = () => macro.enumToString(BlendMode, model.blendMode);
  publicAPI.setAverageIPScalarRange = (min, max) => {
    console.warn('setAverageIPScalarRange is deprecated use setIpScalarRange');
    publicAPI.setIpScalarRange(min, max);
  };
  publicAPI.getFilterModeAsString = () => macro.enumToString(FilterMode, model.filterMode);
  publicAPI.setFilterModeToOff = () => {
    publicAPI.setFilterMode(FilterMode.OFF);
  };
  publicAPI.setFilterModeToNormalized = () => {
    publicAPI.setFilterMode(FilterMode.NORMALIZED);
  };
  publicAPI.setFilterModeToRaw = () => {
    publicAPI.setFilterMode(FilterMode.RAW);
  };
  publicAPI.setGlobalIlluminationReach = gl => superClass.setGlobalIlluminationReach(clampValue(gl, 0.0, 1.0));
  publicAPI.setVolumetricScatteringBlending = vsb => superClass.setVolumetricScatteringBlending(clampValue(vsb, 0.0, 1.0));
  publicAPI.setVolumeShadowSamplingDistFactor = vsdf => superClass.setVolumeShadowSamplingDistFactor(vsdf >= 1.0 ? vsdf : 1.0);
  publicAPI.setAnisotropy = at => superClass.setAnisotropy(clampValue(at, -0.99, 0.99));
  publicAPI.setLAOKernelSize = ks => superClass.setLAOKernelSize(floor(clampValue(ks, 1, 32)));
  publicAPI.setLAOKernelRadius = kr => superClass.setLAOKernelRadius(kr >= 1 ? kr : 1);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

// TODO: what values to use for averageIPScalarRange to get GLSL to use max / min values like [-Math.inf, Math.inf]?
const DEFAULT_VALUES = {
  bounds: [1, -1, 1, -1, 1, -1],
  sampleDistance: 1.0,
  imageSampleDistance: 1.0,
  maximumSamplesPerRay: 1000,
  autoAdjustSampleDistances: true,
  initialInteractionScale: 1.0,
  interactionSampleDistanceFactor: 1.0,
  blendMode: BlendMode.COMPOSITE_BLEND,
  ipScalarRange: [-1000000.0, 1000000.0],
  filterMode: FilterMode.OFF,
  // ignored by WebGL so no behavior change
  preferSizeOverAccuracy: false,
  // Whether to use halfFloat representation of float, when it is inaccurate
  computeNormalFromOpacity: false,
  // volume shadow parameters
  volumetricScatteringBlending: 0.0,
  globalIlluminationReach: 0.0,
  volumeShadowSamplingDistFactor: 5.0,
  anisotropy: 0.0,
  // local ambient occlusion
  localAmbientOcclusion: false,
  LAOKernelSize: 15,
  LAOKernelRadius: 7
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  vtkAbstractMapper.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['sampleDistance', 'imageSampleDistance', 'maximumSamplesPerRay', 'autoAdjustSampleDistances', 'initialInteractionScale', 'interactionSampleDistanceFactor', 'blendMode', 'filterMode', 'preferSizeOverAccuracy', 'computeNormalFromOpacity', 'volumetricScatteringBlending', 'globalIlluminationReach', 'volumeShadowSamplingDistFactor', 'anisotropy', 'localAmbientOcclusion', 'LAOKernelSize', 'LAOKernelRadius']);
  macro.setGetArray(publicAPI, model, ['ipScalarRange'], 2);
  macro.event(publicAPI, model, 'lightingActivated');

  // Object methods
  vtkVolumeMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkVolumeMapper');

// ----------------------------------------------------------------------------

var vtkVolumeMapper$1 = {
  newInstance,
  extend,
  ...STATIC
};

export { STATIC, vtkVolumeMapper$1 as default, extend, newInstance };
