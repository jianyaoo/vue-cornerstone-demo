import vtkColorMaps from './Core/ColorTransferFunction/ColorMaps.js';
import vtkAbstractMapper from './Core/AbstractMapper.js';
import vtkAbstractMapper3D from './Core/AbstractMapper3D.js';
import vtkAbstractPicker from './Core/AbstractPicker.js';
import vtkActor from './Core/Actor.js';
import vtkActor2D from './Core/Actor2D.js';
import vtkAnnotatedCubeActor from './Core/AnnotatedCubeActor.js';
import vtkAxesActor from './Core/AxesActor.js';
import vtkCamera from './Core/Camera.js';
import vtkCellPicker from './Core/CellPicker.js';
import vtkColorTransferFunction from './Core/ColorTransferFunction.js';
import vtkCoordinate from './Core/Coordinate.js';
import vtkCubeAxesActor from './Core/CubeAxesActor.js';
import vtkFollower from './Core/Follower.js';
import vtkGlyph3DMapper from './Core/Glyph3DMapper.js';
import vtkHardwareSelector from './Core/HardwareSelector.js';
import vtkImageMapper from './Core/ImageMapper.js';
import vtkImageProperty from './Core/ImageProperty.js';
import vtkImageResliceMapper from './Core/ImageResliceMapper.js';
import vtkImageSlice from './Core/ImageSlice.js';
import vtkInteractorObserver from './Core/InteractorObserver.js';
import vtkInteractorStyle from './Core/InteractorStyle.js';
import vtkLight from './Core/Light.js';
import vtkMapper from './Core/Mapper.js';
import vtkMapper2D from './Core/Mapper2D.js';
import vtkPicker from './Core/Picker.js';
import vtkPixelSpaceCallbackMapper from './Core/PixelSpaceCallbackMapper.js';
import vtkPointPicker from './Core/PointPicker.js';
import vtkProp from './Core/Prop.js';
import vtkProp3D from './Core/Prop3D.js';
import vtkProperty from './Core/Property.js';
import vtkProperty2D from './Core/Property2D.js';
import vtkRenderer from './Core/Renderer.js';
import vtkRenderWindow from './Core/RenderWindow.js';
import vtkRenderWindowInteractor from './Core/RenderWindowInteractor.js';
import vtkScalarBarActor from './Core/ScalarBarActor.js';
import vtkSkybox from './Core/Skybox.js';
import vtkSphereMapper from './Core/SphereMapper.js';
import vtkStickMapper from './Core/StickMapper.js';
import vtkTexture from './Core/Texture.js';
import vtkViewport from './Core/Viewport.js';
import vtkVolume from './Core/Volume.js';
import vtkVolumeMapper from './Core/VolumeMapper.js';
import vtkVolumeProperty from './Core/VolumeProperty.js';

// Bundle size management - start
var Core = {
  vtkAbstractMapper,
  vtkAbstractMapper3D,
  vtkAbstractPicker,
  vtkActor,
  vtkActor2D,
  vtkAnnotatedCubeActor,
  vtkAxesActor,
  vtkCamera,
  vtkCellPicker,
  vtkColorTransferFunction: {
    vtkColorMaps,
    ...vtkColorTransferFunction
  },
  vtkCoordinate,
  vtkCubeAxesActor,
  vtkFollower,
  vtkGlyph3DMapper,
  vtkHardwareSelector,
  vtkImageMapper,
  vtkImageProperty,
  vtkImageResliceMapper,
  vtkImageSlice,
  vtkInteractorObserver,
  vtkInteractorStyle,
  vtkLight,
  vtkMapper,
  vtkMapper2D,
  vtkPicker,
  vtkPixelSpaceCallbackMapper,
  vtkPointPicker,
  vtkProp,
  vtkProp3D,
  vtkProperty,
  vtkProperty2D,
  vtkRenderer,
  vtkRenderWindow,
  vtkRenderWindowInteractor,
  vtkScalarBarActor,
  vtkSkybox,
  vtkSphereMapper,
  vtkStickMapper,
  vtkTexture,
  vtkViewport,
  vtkVolume,
  vtkVolumeMapper,
  vtkVolumeProperty
};

export { Core as default };
