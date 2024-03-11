import { m as macro } from '../../macros2.js';
import vtkWebGPUFullScreenQuad from './FullScreenQuad.js';
import vtkWebGPUOpaquePass from './OpaquePass.js';
import vtkWebGPUOrderIndepenentTranslucentPass from './OrderIndependentTranslucentPass.js';
import vtkWebGPURenderEncoder from './RenderEncoder.js';
import vtkWebGPUVolumePass from './VolumePass.js';
import vtkRenderPass from '../SceneGraph/RenderPass.js';
import vtkWebGPUSampler from './Sampler.js';
import vtkWebGPUTextureView from './TextureView.js';

const finalBlitFragTemplate = `
//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var computedColor: vec4<f32> = clamp(textureSampleLevel(opaquePassColorTexture, finalPassSampler, input.tcoordVS, 0.0),vec4<f32>(0.0),vec4<f32>(1.0));

  //VTK::RenderEncoder::Impl
  return output;
}
`;

// ----------------------------------------------------------------------------

function vtkForwardPass(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkForwardPass');

  // this pass implements a forward rendering pipeline
  // if both volumes and opaque geometry are present
  // it will mix the two together by capturing a zbuffer
  // first
  publicAPI.traverse = function (viewNode) {
    let parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (model.deleted) {
      return;
    }

    // we just render our delegates in order
    model._currentParent = parent;

    // build
    publicAPI.setCurrentOperation('buildPass');
    viewNode.traverse(publicAPI);
    if (!model.opaquePass) {
      model.opaquePass = vtkWebGPUOpaquePass.newInstance();
    }
    const numlayers = viewNode.getRenderable().getNumberOfLayers();

    // iterate over renderers
    const renderers = viewNode.getChildren();
    for (let i = 0; i < numlayers; i++) {
      for (let index = 0; index < renderers.length; index++) {
        const renNode = renderers[index];
        const ren = viewNode.getRenderable().getRenderers()[index];
        if (ren.getDraw() && ren.getLayer() === i) {
          // check for both opaque and volume actors
          model.opaqueActorCount = 0;
          model.translucentActorCount = 0;
          model.volumes = [];
          publicAPI.setCurrentOperation('queryPass');
          renNode.traverse(publicAPI);
          publicAPI.setCurrentOperation('cameraPass');
          renNode.traverse(publicAPI);

          // always do opaque pass to get a valid color and zbuffer, even if empty
          model.opaquePass.traverse(renNode, viewNode);

          // optional translucent pass
          if (model.translucentActorCount > 0) {
            if (!model.translucentPass) {
              model.translucentPass = vtkWebGPUOrderIndepenentTranslucentPass.newInstance();
            }
            model.translucentPass.setColorTextureView(model.opaquePass.getColorTextureView());
            model.translucentPass.setDepthTextureView(model.opaquePass.getDepthTextureView());
            model.translucentPass.traverse(renNode, viewNode);
          }

          // optional volume pass
          if (model.volumes.length > 0) {
            if (!model.volumePass) {
              model.volumePass = vtkWebGPUVolumePass.newInstance();
            }
            model.volumePass.setColorTextureView(model.opaquePass.getColorTextureView());
            model.volumePass.setDepthTextureView(model.opaquePass.getDepthTextureView());
            model.volumePass.setVolumes(model.volumes);
            model.volumePass.traverse(renNode, viewNode);
          }

          // blit the result into the swap chain
          publicAPI.finalPass(viewNode, renNode);
        }
      }
    }
  };
  publicAPI.finalPass = (viewNode, renNode) => {
    if (!model._finalBlitEncoder) {
      publicAPI.createFinalBlitEncoder(viewNode);
    }
    model._finalBlitOutputTextureView.createFromTextureHandle(viewNode.getCurrentTexture(), {
      depth: 1,
      format: viewNode.getPresentationFormat()
    });
    model._finalBlitEncoder.attachTextureViews();
    model._finalBlitEncoder.begin(viewNode.getCommandEncoder());
    renNode.scissorAndViewport(model._finalBlitEncoder);
    model._fullScreenQuad.prepareAndDraw(model._finalBlitEncoder);
    model._finalBlitEncoder.end();
  };
  publicAPI.createFinalBlitEncoder = viewNode => {
    model._finalBlitEncoder = vtkWebGPURenderEncoder.newInstance({
      label: 'forwardPassBlit'
    });
    model._finalBlitEncoder.setDescription({
      colorAttachments: [{
        view: null,
        loadOp: 'load',
        storeOp: 'store'
      }]
    });
    model._finalBlitEncoder.setPipelineHash('fpf');
    model._finalBlitEncoder.setPipelineSettings({
      primitive: {
        cullMode: 'none'
      },
      fragment: {
        targets: [{
          format: viewNode.getPresentationFormat(),
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
    });
    model._fsqSampler = vtkWebGPUSampler.newInstance({
      label: 'finalPassSampler'
    });
    model._fsqSampler.create(viewNode.getDevice(), {
      minFilter: 'linear',
      magFilter: 'linear'
    });
    model._fullScreenQuad = vtkWebGPUFullScreenQuad.newInstance();
    model._fullScreenQuad.setDevice(viewNode.getDevice());
    model._fullScreenQuad.setPipelineHash('fpfsq');
    model._fullScreenQuad.setTextureViews([model.opaquePass.getColorTextureView()]);
    model._fullScreenQuad.setAdditionalBindables([model._fsqSampler]);
    model._fullScreenQuad.setFragmentShaderTemplate(finalBlitFragTemplate);
    model._finalBlitOutputTextureView = vtkWebGPUTextureView.newInstance();
    model._finalBlitEncoder.setColorTextureView(0, model._finalBlitOutputTextureView);
  };
  publicAPI.incrementOpaqueActorCount = () => model.opaqueActorCount++;
  publicAPI.incrementTranslucentActorCount = () => model.translucentActorCount++;
  publicAPI.addVolume = volume => {
    model.volumes.push(volume);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  opaqueActorCount: 0,
  translucentActorCount: 0,
  volumes: null,
  opaqueRenderEncoder: null,
  translucentPass: null,
  volumePass: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  vtkRenderPass.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['opaquePass', 'translucentPass', 'volumePass']);

  // Object methods
  vtkForwardPass(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkForwardPass');

// ----------------------------------------------------------------------------

var vtkForwardPass$1 = {
  newInstance,
  extend
};

export { vtkForwardPass$1 as default, extend, newInstance };
