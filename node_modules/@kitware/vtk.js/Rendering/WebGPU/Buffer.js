import { m as macro } from '../../macros2.js';
import Constants from './BufferManager/Constants.js';

// methods we forward to the handle
const forwarded = ['getMappedRange', 'mapAsync', 'unmap'];
function bufferSubData(device, destBuffer, destOffset, srcArrayBuffer) {
  const byteCount = srcArrayBuffer.byteLength;
  const srcBuffer = device.createBuffer({
    size: byteCount,
    /* eslint-disable no-undef */
    usage: GPUBufferUsage.COPY_SRC,
    /* eslint-enable no-undef */
    mappedAtCreation: true
  });
  const arrayBuffer = srcBuffer.getMappedRange(0, byteCount);
  new Uint8Array(arrayBuffer).set(new Uint8Array(srcArrayBuffer)); // memcpy
  srcBuffer.unmap();
  const encoder = device.createCommandEncoder();
  encoder.copyBufferToBuffer(srcBuffer, 0, destBuffer, destOffset, byteCount);
  const commandBuffer = encoder.finish();
  const queue = device.queue;
  queue.submit([commandBuffer]);
  srcBuffer.destroy();
}
// ----------------------------------------------------------------------------
// vtkWebGPUBufferManager methods
// ----------------------------------------------------------------------------

function vtkWebGPUBuffer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWebGPUBuffer');
  publicAPI.create = (sizeInBytes, usage) => {
    model.handle = model.device.getHandle().createBuffer({
      size: sizeInBytes,
      usage,
      label: model.label
    });
    model.sizeInBytes = sizeInBytes;
    model.usage = usage;
  };
  publicAPI.write = data => {
    bufferSubData(model.device.getHandle(), model.handle, 0, data.buffer);
  };
  publicAPI.createAndWrite = (data, usage) => {
    model.handle = model.device.getHandle().createBuffer({
      size: data.byteLength,
      usage,
      mappedAtCreation: true,
      label: model.label
    });
    model.sizeInBytes = data.byteLength;
    model.usage = usage;
    new Uint8Array(model.handle.getMappedRange()).set(new Uint8Array(data.buffer)); // memcpy
    model.handle.unmap();
  };

  // simple forwarders
  for (let i = 0; i < forwarded.length; i++) {
    publicAPI[forwarded[i]] = function () {
      return model.handle[forwarded[i]](...arguments);
    };
  }
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  device: null,
  handle: null,
  sizeInBytes: 0,
  strideInBytes: 0,
  arrayInformation: null,
  usage: null,
  label: null,
  sourceTime: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['handle', 'sizeInBytes', 'usage']);
  macro.setGet(publicAPI, model, ['strideInBytes', 'device', 'arrayInformation', 'label', 'sourceTime']);
  vtkWebGPUBuffer(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend);

// ----------------------------------------------------------------------------

var vtkWebGPUBuffer$1 = {
  newInstance,
  extend,
  ...Constants
};

export { vtkWebGPUBuffer$1 as default, extend, newInstance };
