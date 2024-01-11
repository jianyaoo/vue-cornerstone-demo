import { n as newInstance$1, o as obj, g as get, e as setGet } from '../../macros2.js';
import vtkWebGPUShaderCache from './ShaderCache.js';

// methods we forward to the handle
const forwarded = ['setBindGroup', 'setIndexBuffer', 'setVertexBuffer', 'draw', 'drawIndexed'];

// ----------------------------------------------------------------------------
// vtkWebGPURenderEncoder methods
// ----------------------------------------------------------------------------
function vtkWebGPURenderEncoder(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWebGPURenderEncoder');
  publicAPI.begin = encoder => {
    model.drawCallbacks = [];
    model.handle = encoder.beginRenderPass(model.description);
    if (model.label) {
      model.handle.pushDebugGroup(model.label);
    }
  };
  publicAPI.end = () => {
    // loop over registered pipelines and their callbacks
    for (let i = 0; i < model.drawCallbacks.length; i++) {
      const pStruct = model.drawCallbacks[i];
      const pl = pStruct.pipeline;
      publicAPI.setPipeline(pl);
      for (let cb = 0; cb < pStruct.callbacks.length; cb++) {
        pStruct.callbacks[cb](publicAPI);
      }
    }
    if (model.label) {
      model.handle.popDebugGroup();
    }
    model.handle.end();
    model.boundPipeline = null;
  };
  publicAPI.setPipeline = pl => {
    if (model.boundPipeline === pl) {
      return;
    }
    model.handle.setPipeline(pl.getHandle());
    const pd = pl.getPipelineDescription();

    // check attachment state
    if (model.colorTextureViews.length !== pd.fragment.targets.length) {
      console.log(`mismatched attachment counts on pipeline ${pd.fragment.targets.length} while encoder has ${model.colorTextureViews.length}`);
      console.trace();
    } else {
      for (let i = 0; i < model.colorTextureViews.length; i++) {
        const fmt = model.colorTextureViews[i].getTexture()?.getFormat();
        if (fmt && fmt !== pd.fragment.targets[i].format) {
          console.log(`mismatched attachments for attachment ${i} on pipeline ${pd.fragment.targets[i].format} while encoder has ${fmt}`);
          console.trace();
        }
      }
    }

    // check depth buffer
    if (!model.depthTextureView !== !('depthStencil' in pd)) {
      console.log('mismatched depth attachments');
      console.trace();
    } else if (model.depthTextureView) {
      const dfmt = model.depthTextureView.getTexture()?.getFormat();
      if (dfmt && dfmt !== pd.depthStencil.format) {
        console.log(`mismatched depth attachments on pipeline ${pd.depthStencil.format} while encoder has ${dfmt}`);
        console.trace();
      }
    }
    model.boundPipeline = pl;
  };
  publicAPI.replaceShaderCode = pipeline => {
    model.replaceShaderCodeFunction(pipeline);
  };
  publicAPI.setColorTextureView = (idx, view) => {
    if (model.colorTextureViews[idx] === view) {
      return;
    }
    model.colorTextureViews[idx] = view;
  };
  publicAPI.activateBindGroup = bg => {
    const device = model.boundPipeline.getDevice();
    const midx = model.boundPipeline.getBindGroupLayoutCount(bg.getLabel());
    model.handle.setBindGroup(midx, bg.getBindGroup(device));
    // verify bind group layout matches
    const bgl1 = device.getBindGroupLayoutDescription(bg.getBindGroupLayout(device));
    const bgl2 = device.getBindGroupLayoutDescription(model.boundPipeline.getBindGroupLayout(midx));
    if (bgl1 !== bgl2) {
      console.log(`renderEncoder ${model.pipelineHash} mismatched bind group layouts bind group has\n${bgl1}\n versus pipeline\n${bgl2}\n`);
      console.trace();
    }
  };
  publicAPI.attachTextureViews = () => {
    // for each texture create a view if we do not already have one
    for (let i = 0; i < model.colorTextureViews.length; i++) {
      if (!model.description.colorAttachments[i]) {
        model.description.colorAttachments[i] = {
          view: model.colorTextureViews[i].getHandle()
        };
      } else {
        model.description.colorAttachments[i].view = model.colorTextureViews[i].getHandle();
      }
    }
    if (model.depthTextureView) {
      model.description.depthStencilAttachment.view = model.depthTextureView.getHandle();
    }
  };

  // register pipeline callbacks from a mapper
  publicAPI.registerDrawCallback = (pipeline, cb) => {
    // if there is a matching pipeline just add the cb
    for (let i = 0; i < model.drawCallbacks.length; i++) {
      if (model.drawCallbacks[i].pipeline === pipeline) {
        model.drawCallbacks[i].callbacks.push(cb);
        return;
      }
    }
    model.drawCallbacks.push({
      pipeline,
      callbacks: [cb]
    });
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
  description: null,
  handle: null,
  boundPipeline: null,
  pipelineHash: null,
  pipelineSettings: null,
  replaceShaderCodeFunction: null,
  depthTextureView: null,
  label: null
};

// ----------------------------------------------------------------------------
function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  obj(publicAPI, model);
  model.description = {
    colorAttachments: [{
      view: undefined,
      loadOp: 'load',
      storeOp: 'store'
    }],
    depthStencilAttachment: {
      view: undefined,
      depthLoadOp: 'clear',
      depthClearValue: 0.0,
      depthStoreOp: 'store'
    }
  };

  // default shader code just writes out the computedColor
  model.replaceShaderCodeFunction = pipeline => {
    const fDesc = pipeline.getShaderDescription('fragment');
    fDesc.addOutput('vec4<f32>', 'outColor');
    let code = fDesc.getCode();
    code = vtkWebGPUShaderCache.substitute(code, '//VTK::RenderEncoder::Impl', ['output.outColor = computedColor;']).result;
    fDesc.setCode(code);
  };

  // default pipeline settings
  model.pipelineSettings = {
    primitive: {
      cullMode: 'none'
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'greater-equal',
      format: 'depth32float'
    },
    fragment: {
      targets: [{
        format: 'rgba16float',
        blend: {
          color: {
            srcFactor: 'src-alpha',
            dstFactor: 'one-minus-src-alpha'
          },
          alpha: {
            srcfactor: 'one',
            dstFactor: 'one-minus-src-alpha'
          }
        }
      }]
    }
  };
  model.colorTextureViews = [];
  get(publicAPI, model, ['boundPipeline', 'colorTextureViews']);
  setGet(publicAPI, model, ['depthTextureView', 'description', 'handle', 'label', 'pipelineHash', 'pipelineSettings', 'replaceShaderCodeFunction']);

  // For more macro methods, see "Sources/macros.js"
  // Object specific methods
  vtkWebGPURenderEncoder(publicAPI, model);
}

// ----------------------------------------------------------------------------
const newInstance = newInstance$1(extend, 'vtkWebGPURenderEncoder');

// ----------------------------------------------------------------------------
var vtkWebGPURenderEncoder$1 = {
  newInstance,
  extend
};

export { vtkWebGPURenderEncoder$1 as default, extend, newInstance };
