import { unzipSync, strFromU8 } from 'fflate';
import DataAccessHelper from './DataAccessHelper.js';
import { m as macro } from '../../macros2.js';
import './DataAccessHelper/HttpDataAccessHelper.js';

// import 'vtk.js/Sources/IO/Core/DataAccessHelper/HtmlDataAccessHelper'; // html + base64 + zip
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/JSZipDataAccessHelper'; // zip

// ----------------------------------------------------------------------------
// vtkAppendPolyData methods
// ----------------------------------------------------------------------------

function vtkZipMultiDataSetReader(publicAPI, model) {
  // Set our classname
  model.classHierarchy.push('vtkZipMultiDataSetReader');

  // Create default dataAccessHelper if not available
  if (!model.dataAccessHelper) {
    model.dataAccessHelper = DataAccessHelper.get('http');
  }

  // Internal method to fetch Array
  function fetchData(url) {
    let option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return model.dataAccessHelper.fetchBinary(url, option);
  }

  // Set DataSet url
  publicAPI.setUrl = function (url) {
    let option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    model.url = url;

    // Remove the file in the URL
    const path = url.split('/');
    path.pop();
    model.baseURL = path.join('/');

    // Fetch metadata
    return publicAPI.loadData(option);
  };

  // Fetch the actual data arrays
  publicAPI.loadData = function () {
    let option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return fetchData(model.url, option).then(publicAPI.parseAsArrayBuffer);
  };
  publicAPI.parseAsArrayBuffer = arrayBuffer => {
    if (!arrayBuffer) {
      return Promise.reject(new Error('No ArrayBuffer to parse'));
    }
    return new Promise((resolve, reject) => {
      model.arrays = [];
      const decompressedFiles = unzipSync(new Uint8Array(arrayBuffer));
      try {
        Object.entries(decompressedFiles).forEach(_ref => {
          let [relativePath, fileData] = _ref;
          if (relativePath.match(/datasets\.json$/i)) {
            model.datasets = JSON.parse(strFromU8(fileData));
          }
          if (relativePath.match(/array_[a-zA-Z]+_[0-9]+/)) {
            const [type, id] = relativePath.split('_').slice(-2);
            model.arrays[id] = macro.newTypedArray(type, fileData.buffer);
          }
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };
  publicAPI.requestData = (inData, outData) => {
    // perform deserialization
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Make this a VTK object
  macro.obj(publicAPI, model);

  // Also make it an algorithm with one input and one output
  macro.algo(publicAPI, model, 0, 0);
  macro.get(publicAPI, model, ['url', 'baseURL']);
  macro.setGet(publicAPI, model, ['dataAccessHelper']);

  // Object specific methods
  vtkZipMultiDataSetReader(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkZipMultiDataSetReader');

// ----------------------------------------------------------------------------

var index = {
  newInstance,
  extend
};

export { index as default, extend, newInstance };
