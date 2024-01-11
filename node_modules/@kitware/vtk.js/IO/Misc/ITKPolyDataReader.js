import { m as macro } from '../../macros2.js';
import vtk from '../../vtk.js';

let readPolyDataArrayBuffer = null;
let resultPreprocessor = result => result;
function setReadPolyDataArrayBufferFromITK(fn) {
  readPolyDataArrayBuffer = fn;

  // first arg is a webworker if reuse is desired.
  readPolyDataArrayBuffer = function () {
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
      polyData
    } = _ref;
    webWorker.terminate();
    return polyData;
  };
}

// ----------------------------------------------------------------------------
// vtkITKPolyDataReader methods
// ----------------------------------------------------------------------------

function vtkITKPolyDataReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkITKPolyDataReader');

  // Returns a promise to signal when polyData is ready
  publicAPI.parseAsArrayBuffer = arrayBuffer => {
    if (!arrayBuffer || arrayBuffer === model.rawDataBuffer) {
      return Promise.resolve();
    }
    model.rawDataBuffer = arrayBuffer;
    return readPolyDataArrayBuffer(arrayBuffer, model.fileName).then(resultPreprocessor).then(polyData => {
      model.output[0] = vtk(polyData);
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

  // vtkITKPolyDataReader methods
  vtkITKPolyDataReader(publicAPI, model);

  // Check that ITK function has been injected
  if (!readPolyDataArrayBuffer) {
    console.error(`
      // Dependency needs to be added inside your project
      import readPolyDataArrayBuffer from 'itk/readPolyDataArrayBuffer';
      vtkITKPolyDataReader.setReadPolyDataArrayBufferFromITK(readPolyDataArrayBuffer);
      `);
  }
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkITKPolyDataReader');

// ----------------------------------------------------------------------------

var vtkITKPolyDataReader$1 = {
  newInstance,
  extend,
  setReadPolyDataArrayBufferFromITK
};

export { vtkITKPolyDataReader$1 as default, extend, newInstance };
