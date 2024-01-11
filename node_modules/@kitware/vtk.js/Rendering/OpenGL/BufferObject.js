import { m as macro } from '../../macros2.js';
import Constants from './BufferObject/Constants.js';

const {
  ObjectType
} = Constants;

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

const STATIC = {};

// ----------------------------------------------------------------------------
// vtkOpenGLBufferObject methods
// ----------------------------------------------------------------------------

function vtkOpenGLBufferObject(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLBufferObject');

  // Class-specific private functions
  function convertType(type) {
    switch (type) {
      case ObjectType.ELEMENT_ARRAY_BUFFER:
        return model.context.ELEMENT_ARRAY_BUFFER;
      case ObjectType.TEXTURE_BUFFER:
        if ('TEXTURE_BUFFER' in model.context) {
          return model.context.TEXTURE_BUFFER;
        }
      /* eslint-disable no-fallthrough */
      // Intentional fallthrough in case there is no TEXTURE_BUFFER in WebGL
      case ObjectType.ARRAY_BUFFER:
      default:
        return model.context.ARRAY_BUFFER;
      /* eslint-enable no-fallthrough */
    }
  }

  let internalType = null;
  let internalHandle = null;
  let dirty = true;
  let error = '';

  // Public API methods
  publicAPI.getType = () => internalType;
  publicAPI.setType = value => {
    internalType = value;
  };
  publicAPI.getHandle = () => internalHandle;
  publicAPI.isReady = () => dirty === false;
  publicAPI.generateBuffer = type => {
    const objectTypeGL = convertType(type);
    if (internalHandle === null) {
      internalHandle = model.context.createBuffer();
      internalType = type;
    }
    return convertType(internalType) === objectTypeGL;
  };
  publicAPI.upload = (data, type) => {
    // buffer, size, type
    const alreadyGenerated = publicAPI.generateBuffer(type);
    if (!alreadyGenerated) {
      error = 'Trying to upload array buffer to incompatible buffer.';
      return false;
    }
    model.context.bindBuffer(convertType(internalType), internalHandle);
    model.context.bufferData(convertType(internalType), data, model.context.STATIC_DRAW);
    model.allocatedGPUMemoryInBytes = data.length * data.BYTES_PER_ELEMENT;
    dirty = false;
    return true;
  };
  publicAPI.bind = () => {
    if (!internalHandle) {
      return false;
    }
    model.context.bindBuffer(convertType(internalType), internalHandle);
    return true;
  };
  publicAPI.release = () => {
    if (!internalHandle) {
      return false;
    }
    model.context.bindBuffer(convertType(internalType), null);
    return true;
  };
  publicAPI.releaseGraphicsResources = () => {
    if (internalHandle !== null) {
      model.context.bindBuffer(convertType(internalType), null);
      model.context.deleteBuffer(internalHandle);
      internalHandle = null;
      model.allocatedGPUMemoryInBytes = 0;
    }
  };
  publicAPI.setOpenGLRenderWindow = rw => {
    if (model._openGLRenderWindow === rw) {
      return;
    }
    publicAPI.releaseGraphicsResources();
    model._openGLRenderWindow = rw;
    model.context = null;
    if (rw) {
      model.context = model._openGLRenderWindow.getContext();
    }
  };
  publicAPI.getError = () => error;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  objectType: ObjectType.ARRAY_BUFFER,
  // _openGLRenderWindow: null,
  context: null,
  allocatedGPUMemoryInBytes: 0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['_openGLRenderWindow', 'allocatedGPUMemoryInBytes']);
  macro.moveToProtected(publicAPI, model, ['openGLRenderWindow']);
  vtkOpenGLBufferObject(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend);

// ----------------------------------------------------------------------------

var vtkBufferObject = {
  newInstance,
  extend,
  ...STATIC,
  ...Constants
};

export { STATIC, vtkBufferObject as default, extend, newInstance };
