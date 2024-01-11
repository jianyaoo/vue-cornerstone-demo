import { m as macro } from '../../macros2.js';
import vtkActor from './Actor.js';
import vtkMapper from './Mapper.js';
import vtkTexture from './Texture.js';
import vtkCubeSource from '../../Filters/Sources/CubeSource.js';
import ImageHelper from '../../Common/Core/ImageHelper.js';
import AnnotatedCubePresets from './AnnotatedCubeActor/Presets.js';

const FACE_TO_INDEX = {
  xPlus: 0,
  xMinus: 1,
  yPlus: 2,
  yMinus: 3,
  zPlus: 4,
  zMinus: 5
};

// ----------------------------------------------------------------------------
// vtkAnnotatedCubeActor
// ----------------------------------------------------------------------------

function vtkAnnotatedCubeActor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkAnnotatedCubeActor');

  // Make sure face properties are not references to the default value
  model.xPlusFaceProperty = {
    ...model.xPlusFaceProperty
  };
  model.xMinusFaceProperty = {
    ...model.xMinusFaceProperty
  };
  model.yPlusFaceProperty = {
    ...model.yPlusFaceProperty
  };
  model.yMinusFaceProperty = {
    ...model.yMinusFaceProperty
  };
  model.zPlusFaceProperty = {
    ...model.zPlusFaceProperty
  };
  model.zMinusFaceProperty = {
    ...model.zMinusFaceProperty
  };

  // private variables

  let cubeSource = null;
  const canvas = document.createElement('canvas');
  const mapper = vtkMapper.newInstance();
  const texture = vtkTexture.newInstance();
  texture.setInterpolate(true);

  // private methods

  function updateFaceTexture(faceName) {
    let newProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (newProp) {
      Object.assign(model[`${faceName}FaceProperty`], newProp);
    }
    const prop = {
      ...model.defaultStyle,
      ...model[`${faceName}FaceProperty`]
    };

    // set canvas resolution
    canvas.width = prop.resolution;
    canvas.height = prop.resolution;
    const ctxt = canvas.getContext('2d');

    // set background color
    ctxt.fillStyle = prop.faceColor;
    ctxt.fillRect(0, 0, canvas.width, canvas.height);

    // draw edge
    if (prop.edgeThickness > 0) {
      ctxt.strokeStyle = prop.edgeColor;
      ctxt.lineWidth = prop.edgeThickness * canvas.width;
      ctxt.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // set face rotation
    ctxt.save();

    // vertical flip
    ctxt.translate(0, canvas.height);
    ctxt.scale(1, -1);
    ctxt.translate(canvas.width / 2, canvas.height / 2);
    ctxt.rotate(-Math.PI * (prop.faceRotation / 180.0));

    // set foreground text
    const textSize = prop.fontSizeScale(prop.resolution);
    ctxt.fillStyle = prop.fontColor;
    ctxt.textAlign = 'center';
    ctxt.textBaseline = 'middle';
    ctxt.font = `${prop.fontStyle} ${textSize}px "${prop.fontFamily}"`;
    ctxt.fillText(prop.text, 0, 0);
    ctxt.restore();
    const vtkImage = ImageHelper.canvasToImageData(canvas);
    texture.setInputData(vtkImage, FACE_TO_INDEX[faceName]);
    publicAPI.modified();
  }
  function updateAllFaceTextures() {
    cubeSource = vtkCubeSource.newInstance({
      generate3DTextureCoordinates: true
    });
    mapper.setInputConnection(cubeSource.getOutputPort());
    updateFaceTexture('xPlus');
    updateFaceTexture('xMinus');
    updateFaceTexture('yPlus');
    updateFaceTexture('yMinus');
    updateFaceTexture('zPlus');
    updateFaceTexture('zMinus');
  }

  // public methods

  publicAPI.setDefaultStyle = style => {
    model.defaultStyle = {
      ...model.defaultStyle,
      ...style
    };
    updateAllFaceTextures();
  };
  publicAPI.setXPlusFaceProperty = prop => updateFaceTexture('xPlus', prop);
  publicAPI.setXMinusFaceProperty = prop => updateFaceTexture('xMinus', prop);
  publicAPI.setYPlusFaceProperty = prop => updateFaceTexture('yPlus', prop);
  publicAPI.setYMinusFaceProperty = prop => updateFaceTexture('yMinus', prop);
  publicAPI.setZPlusFaceProperty = prop => updateFaceTexture('zPlus', prop);
  publicAPI.setZMinusFaceProperty = prop => updateFaceTexture('zMinus', prop);

  // constructor

  updateAllFaceTextures();

  // set mapper
  mapper.setInputConnection(cubeSource.getOutputPort());
  publicAPI.setMapper(mapper);

  // set texture
  publicAPI.addTexture(texture);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  defaultStyle: {
    text: '',
    faceColor: 'white',
    faceRotation: 0,
    fontFamily: 'Arial',
    fontColor: 'black',
    fontStyle: 'normal',
    fontSizeScale: resolution => resolution / 1.8,
    edgeThickness: 0.1,
    edgeColor: 'black',
    resolution: 200
  }
  // xPlusFaceProperty: null,
  // xMinusFaceProperty: null,
  // yPlusFaceProperty: null,
  // yMinusFaceProperty: null,
  // zPlusFaceProperty: null,
  // zMinusFaceProperty: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkActor.extend(publicAPI, model, initialValues);
  macro.get(publicAPI, model, ['defaultStyle', 'xPlusFaceProperty', 'xMinusFaceProperty', 'yPlusFaceProperty', 'yMinusFaceProperty', 'zPlusFaceProperty', 'zMinusFaceProperty']);

  // Object methods
  vtkAnnotatedCubeActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkAnnotatedCubeActor');

// ----------------------------------------------------------------------------

var vtkAnnotatedCubeActor$1 = {
  newInstance,
  extend,
  Presets: AnnotatedCubePresets
};

export { DEFAULT_VALUES, vtkAnnotatedCubeActor$1 as default, extend, newInstance };
