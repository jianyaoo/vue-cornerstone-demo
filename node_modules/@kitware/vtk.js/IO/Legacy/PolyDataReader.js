import { m as macro } from '../../macros2.js';
import DataAccessHelper from '../Core/DataAccessHelper.js';
import vtkLegacyAsciiParser from './LegacyAsciiParser.js';
import '../Core/DataAccessHelper/LiteHttpDataAccessHelper.js';

// import 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper'; // HTTP + zip
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/HtmlDataAccessHelper'; // html + base64 + zip
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/JSZipDataAccessHelper'; // zip

// ----------------------------------------------------------------------------
// vtkPolyDataReader methods
// ----------------------------------------------------------------------------

function vtkPolyDataReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPolyDataReader');

  // Create default dataAccessHelper if not available
  if (!model.dataAccessHelper) {
    model.dataAccessHelper = DataAccessHelper.get('http');
  }

  // Internal method to fetch Array
  function fetchData(url) {
    const {
      compression,
      progressCallback
    } = model;
    return model.dataAccessHelper.fetchText(publicAPI, url, {
      compression,
      progressCallback
    });
  }

  // Set DataSet url
  publicAPI.setUrl = function (url) {
    let option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    model.url = url;

    // Remove the file in the URL
    const path = url.split('/');
    path.pop();
    model.baseURL = path.join('/');
    model.compression = option.compression;

    // Fetch metadata
    return publicAPI.loadData({
      progressCallback: option.progressCallback
    });
  };

  // Fetch the actual data arrays
  publicAPI.loadData = function () {
    const promise = fetchData(model.url);
    promise.then(publicAPI.parseAsText);
    return promise;
  };
  publicAPI.parseAsText = content => {
    if (!content) {
      return;
    }
    if (content !== model.parseData) {
      publicAPI.modified();
    } else {
      return;
    }
    model.parseData = content;
    model.output[0] = vtkLegacyAsciiParser.parseLegacyASCII(model.parseData).dataset;
  };
  publicAPI.requestData = (inData, outData) => {
    publicAPI.parseAsText(model.parseData);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // baseURL: null,
  // dataAccessHelper: null,
  // url: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['url', 'baseURL']);
  macro.setGet(publicAPI, model, ['dataAccessHelper']);
  macro.algo(publicAPI, model, 0, 1);

  // vtkPolyDataReader methods
  vtkPolyDataReader(publicAPI, model);

  // To support destructuring
  if (!model.compression) {
    model.compression = null;
  }
  if (!model.progressCallback) {
    model.progressCallback = null;
  }
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPolyDataReader');

// ----------------------------------------------------------------------------

var vtkPolyDataReader$1 = {
  newInstance,
  extend
};

export { vtkPolyDataReader$1 as default, extend, newInstance };
