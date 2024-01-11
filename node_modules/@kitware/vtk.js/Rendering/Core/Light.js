import { m as macro } from '../../macros2.js';
import { l as normalize, r as radiansFromDegrees } from '../../Common/Core/Math/index.js';
import { vec3 } from 'gl-matrix';

// ----------------------------------------------------------------------------

const LIGHT_TYPES = ['HeadLight', 'CameraLight', 'SceneLight'];

// ----------------------------------------------------------------------------
// vtkLight methods
// ----------------------------------------------------------------------------

function vtkLight(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLight');
  const tmpVec = new Float64Array(3);
  publicAPI.getTransformedPosition = () => {
    if (model.transformMatrix) {
      vec3.transformMat4(tmpVec, model.position, model.transformMatrix);
    } else {
      vec3.set(tmpVec, model.position[0], model.position[1], model.position[2]);
    }
    return tmpVec;
  };
  publicAPI.getTransformedFocalPoint = () => {
    if (model.transformMatrix) {
      vec3.transformMat4(tmpVec, model.focalPoint, model.transformMatrix);
    } else {
      vec3.set(tmpVec, model.focalPoint[0], model.focalPoint[1], model.focalPoint[2]);
    }
    return tmpVec;
  };
  publicAPI.getDirection = () => {
    if (model.directionMTime < model.mtime) {
      vec3.sub(model.direction, model.focalPoint, model.position);
      normalize(model.direction);
      model.directionMTime = model.mtime;
    }
    return model.direction;
  };

  // Sets the direction from a vec3 instead of a focal point
  publicAPI.setDirection = directionVector => {
    const newFocalPoint = new Float64Array(3);
    vec3.sub(newFocalPoint, model.position, directionVector);
    model.focalPoint = newFocalPoint;
  };
  publicAPI.setDirectionAngle = (elevation, azimuth) => {
    const elevationRadians = radiansFromDegrees(elevation);
    const azimuthRadians = radiansFromDegrees(azimuth);
    publicAPI.setPosition(Math.cos(elevationRadians) * Math.sin(azimuthRadians), Math.sin(elevationRadians), Math.cos(elevationRadians) * Math.cos(azimuthRadians));
    publicAPI.setFocalPoint(0, 0, 0);
    publicAPI.setPositional(0);
  };
  publicAPI.setLightTypeToHeadLight = () => {
    publicAPI.setLightType('HeadLight');
  };
  publicAPI.setLightTypeToCameraLight = () => {
    publicAPI.setLightType('CameraLight');
  };
  publicAPI.setLightTypeToSceneLight = () => {
    publicAPI.setTransformMatrix(null);
    publicAPI.setLightType('SceneLight');
  };
  publicAPI.lightTypeIsHeadLight = () => model.lightType === 'HeadLight';
  publicAPI.lightTypeIsSceneLight = () => model.lightType === 'SceneLight';
  publicAPI.lightTypeIsCameraLight = () => model.lightType === 'CameraLight';
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  switch: true,
  intensity: 1,
  color: [1, 1, 1],
  position: [0, 0, 1],
  focalPoint: [0, 0, 0],
  positional: false,
  exponent: 1,
  coneAngle: 30,
  coneFalloff: 5,
  attenuationValues: [1, 0, 0],
  transformMatrix: null,
  lightType: 'SceneLight',
  shadowAttenuation: 1,
  direction: [0, 0, 0],
  directionMTime: 0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['intensity', 'switch', 'positional', 'exponent', 'coneAngle', 'coneFalloff', 'transformMatrix', 'lightType', 'shadowAttenuation', 'attenuationValues']);
  macro.setGetArray(publicAPI, model, ['color', 'position', 'focalPoint', 'attenuationValues'], 3);

  // Object methods
  vtkLight(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkLight');

// ----------------------------------------------------------------------------

var vtkLight$1 = {
  newInstance,
  extend,
  LIGHT_TYPES
};

export { LIGHT_TYPES, vtkLight$1 as default, extend, newInstance };
