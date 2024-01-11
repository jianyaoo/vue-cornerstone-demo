import { n as newInstance$1, o as obj, g as get, e as setGet } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkWebGPUPipeline methods
// ----------------------------------------------------------------------------
function vtkWebGPUPipeline(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWebGPUPipeline');
  publicAPI.getShaderDescriptions = () => model.shaderDescriptions;
  publicAPI.initialize = (device, hash) => {
    // start with the renderencoder settings
    model.pipelineDescription = model.renderEncoder.getPipelineSettings();
    model.pipelineDescription.primitive.topology = model.topology;
    model.pipelineDescription.vertex = model.vertexState;
    model.pipelineDescription.label = hash;

    // add in bind group layouts
    const bindGroupLayouts = [];
    for (let i = 0; i < model.layouts.length; i++) {
      bindGroupLayouts.push(model.layouts[i].layout);
    }
    model.pipelineLayout = device.getHandle().createPipelineLayout({
      bindGroupLayouts
    });
    model.pipelineDescription.layout = model.pipelineLayout;
    for (let i = 0; i < model.shaderDescriptions.length; i++) {
      const sd = model.shaderDescriptions[i];
      const sm = device.getShaderModule(sd);
      if (sd.getType() === 'vertex') {
        model.pipelineDescription.vertex.module = sm.getHandle();
        model.pipelineDescription.vertex.entryPoint = 'main';
      }
      if (sd.getType() === 'fragment') {
        model.pipelineDescription.fragment.module = sm.getHandle();
        model.pipelineDescription.fragment.entryPoint = 'main';
      }
    }
    model.handle = device.getHandle().createRenderPipeline(model.pipelineDescription);
  };
  publicAPI.getShaderDescription = stype => {
    for (let i = 0; i < model.shaderDescriptions.length; i++) {
      if (model.shaderDescriptions[i].getType() === stype) return model.shaderDescriptions[i];
    }
    return null;
  };
  publicAPI.addBindGroupLayout = bindGroup => {
    if (!bindGroup) {
      return;
    }
    model.layouts.push({
      layout: bindGroup.getBindGroupLayout(model.device),
      label: bindGroup.getLabel()
    });
  };
  publicAPI.getBindGroupLayout = idx => model.layouts[idx].layout;
  publicAPI.getBindGroupLayoutCount = llabel => {
    for (let i = 0; i < model.layouts.length; i++) {
      if (model.layouts[i].label === llabel) {
        return i;
      }
    }
    return 0;
  };
  publicAPI.bindVertexInput = (renderEncoder, vInput) => {
    vInput.bindBuffers(renderEncoder);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------
const DEFAULT_VALUES = {
  handle: null,
  layouts: null,
  renderEncoder: null,
  shaderDescriptions: null,
  vertexState: null,
  topology: null,
  pipelineDescription: null
};

// ----------------------------------------------------------------------------
function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  obj(publicAPI, model);
  model.layouts = [];
  model.shaderDescriptions = [];
  get(publicAPI, model, ['handle', 'pipelineDescription']);
  setGet(publicAPI, model, ['device', 'renderEncoder', 'topology', 'vertexState']);

  // For more macro methods, see "Sources/macros.js"
  // Object specific methods
  vtkWebGPUPipeline(publicAPI, model);
}

// ----------------------------------------------------------------------------
const newInstance = newInstance$1(extend, 'vtkWebGPUPipeline');

// ----------------------------------------------------------------------------
var vtkWebGPUPipeline$1 = {
  newInstance,
  extend
};

export { vtkWebGPUPipeline$1 as default, extend, newInstance };
