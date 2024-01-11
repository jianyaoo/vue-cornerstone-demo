import vtkActor from './OpenGL/Actor.js';
import vtkActor2D from './OpenGL/Actor2D.js';
import vtkBufferObject from './OpenGL/BufferObject.js';
import vtkCamera from './OpenGL/Camera.js';
import vtkCellArrayBufferObject from './OpenGL/CellArrayBufferObject.js';
import vtkConvolution2DPass from './OpenGL/Convolution2DPass.js';
import './OpenGL/CubeAxesActor.js';
import vtkForwardPass from './OpenGL/ForwardPass.js';
import vtkOpenGLFramebuffer from './OpenGL/Framebuffer.js';
import vtkGlyph3DMapper from './OpenGL/Glyph3DMapper.js';
import vtkHardwareSelector from './OpenGL/HardwareSelector.js';
import vtkHelper from './OpenGL/Helper.js';
import vtkImageMapper from './OpenGL/ImageMapper.js';
import vtkImageSlice from './OpenGL/ImageSlice.js';
import vtkPixelSpaceCallbackMapper from './OpenGL/PixelSpaceCallbackMapper.js';
import vtkOpenGLPolyDataMapper from './OpenGL/PolyDataMapper.js';
import vtkPolyDataMapper2D from './OpenGL/PolyDataMapper2D.js';
import vtkRenderer from './OpenGL/Renderer.js';
import vtkRenderWindow from './OpenGL/RenderWindow.js';
import vtkImageResliceMapper from './OpenGL/ImageResliceMapper.js';
import './OpenGL/ScalarBarActor.js';
import vtkShader from './OpenGL/Shader.js';
import vtkShaderCache from './OpenGL/ShaderCache.js';
import vtkShaderProgram from './OpenGL/ShaderProgram.js';
import vtkSkybox from './OpenGL/Skybox.js';
import vtkSphereMapper from './OpenGL/SphereMapper.js';
import vtkStickMapper from './OpenGL/StickMapper.js';
import vtkOpenGLTexture from './OpenGL/Texture.js';
import vtkTextureUnitManager from './OpenGL/TextureUnitManager.js';
import vtkVertexArrayObject from './OpenGL/VertexArrayObject.js';
import vtkViewNodeFactory from './OpenGL/ViewNodeFactory.js';
import vtkVolume from './OpenGL/Volume.js';
import vtkVolumeMapper from './OpenGL/VolumeMapper.js';

var OpenGL = {
  vtkActor,
  vtkActor2D,
  vtkBufferObject,
  vtkCamera,
  vtkCellArrayBufferObject,
  vtkConvolution2DPass,
  vtkForwardPass,
  vtkFramebuffer: vtkOpenGLFramebuffer,
  vtkGlyph3DMapper,
  vtkHardwareSelector,
  vtkHelper,
  vtkImageMapper,
  vtkImageSlice,
  vtkPixelSpaceCallbackMapper,
  vtkPolyDataMapper: vtkOpenGLPolyDataMapper,
  vtkPolyDataMapper2D,
  vtkRenderWindow,
  vtkRenderer,
  vtkImageResliceMapper,
  vtkShader,
  vtkShaderCache,
  vtkShaderProgram,
  vtkSkybox,
  vtkSphereMapper,
  vtkStickMapper,
  vtkTexture: vtkOpenGLTexture,
  vtkTextureUnitManager,
  vtkVertexArrayObject,
  vtkViewNodeFactory,
  vtkVolume,
  vtkVolumeMapper
};

export { OpenGL as default };
