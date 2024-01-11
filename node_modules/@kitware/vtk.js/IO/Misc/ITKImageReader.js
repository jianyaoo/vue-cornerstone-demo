import { m as macro } from '../../macros2.js';
import ITKHelper from '../../Common/DataModel/ITKHelper.js';

const {
  convertItkToVtkImage
} = ITKHelper;
let readImageArrayBuffer = null;
let resultPreprocessor = result => result;
function getArrayName(filename) {
  const idx = filename.lastIndexOf('.');
  const name = idx > -1 ? filename.substring(0, idx) : filename;
  return `Scalars ${name}`;
}
function setReadImageArrayBufferFromITK(fn) {
  readImageArrayBuffer = fn;

  // itk.js 9.0.0 introduced breaking changes, which can be detected
  // by an updated function signature.
  if (readImageArrayBuffer.length === 4) {
    // first arg is a webworker if reuse is desired.
    readImageArrayBuffer = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return fn(null, ...args);
    };

    // an object is now passed out which includes a webworker which we
    // should terminate
    resultPreprocessor = _ref => {
      let {
        webWorker,
        image
      } = _ref;
      webWorker.terminate();
      return image;
    };
  }
}

// ----------------------------------------------------------------------------
// vtkITKImageReader methods
// ----------------------------------------------------------------------------

function vtkITKImageReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkITKImageReader');

  // Returns a promise to signal when image is ready
  publicAPI.parseAsArrayBuffer = arrayBuffer => {
    if (!arrayBuffer || arrayBuffer === model.rawDataBuffer) {
      return Promise.resolve();
    }
    model.rawDataBuffer = arrayBuffer;
    return readImageArrayBuffer(arrayBuffer, model.fileName).then(resultPreprocessor).then(itkImage => {
      const imageData = convertItkToVtkImage(itkImage, {
        scalarArrayName: model.arrayName || getArrayName(model.fileName)
      });
      model.output[0] = imageData;
      publicAPI.modified();
    });
  };
  publicAPI.requestData = (inData, outData) => {
    publicAPI.parseAsArrayBuffer(model.rawDataBuffer, model.fileName);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  fileName: '',
  // If null/undefined a unique array will be generated
  arrayName: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.algo(publicAPI, model, 0, 1);
  macro.setGet(publicAPI, model, ['fileName', 'arrayName']);

  // vtkITKImageReader methods
  vtkITKImageReader(publicAPI, model);

  // Check that ITK function has been injected
  if (!readImageArrayBuffer) {
    console.error(`
      // Dependency needs to be added inside your project
      import readImageArrayBuffer from 'itk/readImageArrayBuffer';
      vtkITKImageReader.setReadImageArrayBufferFromITK(readImageArrayBuffer);
      `);
  }
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkITKImageReader');

// ----------------------------------------------------------------------------

var vtkITKImageReader$1 = {
  newInstance,
  extend,
  setReadImageArrayBufferFromITK
};

export { vtkITKImageReader$1 as default, extend, newInstance };
