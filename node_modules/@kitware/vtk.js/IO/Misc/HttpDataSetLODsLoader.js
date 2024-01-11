import { m as macro } from '../../macros2.js';
import DataAccessHelper from '../Core/DataAccessHelper.js';
import vtkHttpDataSetReader from '../Core/HttpDataSetReader.js';
import '../Core/DataAccessHelper/LiteHttpDataAccessHelper.js';

// import 'vtk.js/Sources/IO/Core/DataAccessHelper/HttpDataAccessHelper'; // HTTP + gz
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/HtmlDataAccessHelper'; // html + base64 + zip
// import 'vtk.js/Sources/IO/Core/DataAccessHelper/JSZipDataAccessHelper'; // zip

const {
  vtkErrorMacro
} = macro;

// ----------------------------------------------------------------------------
// vtkHttpDataSetLODsLoader methods
// ----------------------------------------------------------------------------

function vtkHttpDataSetLODsLoader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkHttpDataSetLODsLoader');
  const internal = {
    downloadStack: []
  };

  //--------------------------------------------------------------------------

  publicAPI.startDownloads = () => {
    if (!model.mapper) {
      vtkErrorMacro('Mapper was not set.');
      return;
    }
    if (!model.files || model.files.length === 0) {
      vtkErrorMacro('No files set.');
      return;
    }
    let baseUrl = model.baseUrl;
    if (baseUrl && !baseUrl.endsWith('/')) {
      baseUrl += '/';
    }

    // Create the download stack
    internal.downloadStack = [];
    model.files.forEach(file => internal.downloadStack.push(`${baseUrl}${file}`));
    const downloadNextSource = () => {
      const url = internal.downloadStack.shift();
      const nextSource = vtkHttpDataSetReader.newInstance({
        dataAccessHelper: DataAccessHelper.get('http')
      });
      model.currentSource = nextSource;
      const options = {
        compression: 'zip',
        loadData: true,
        fullpath: true
      };
      nextSource.setUrl(url, options).then(() => {
        model.mapper.setInputConnection(nextSource.getOutputPort());
        if (model.sceneItem) {
          // Apply settings to the new source
          const settings = model.sceneItem.defaultSettings;
          if (settings.mapper) {
            if (settings.mapper.colorByArrayName) {
              nextSource.enableArray(settings.mapper.colorByArrayName, settings.mapper.colorByArrayName);
            }
          }
          model.sceneItem.source = nextSource;
        }
        if (model.stepFinishedCallback) {
          // In clients like paraview glance, the callback might
          // involve setting the current source on a proxy
          model.stepFinishedCallback();
        }
        if (internal.downloadStack.length !== 0) {
          setTimeout(downloadNextSource, model.waitTimeBetweenDownloads);
        }
      });
    };
    setTimeout(downloadNextSource, model.waitTimeToStart);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  baseUrl: '',
  // The currentSource is set internally to the most recently
  // created source. It might be useful to access it in a callback
  // via 'getCurrentSource'.
  currentSource: null,
  files: [],
  mapper: null,
  sceneItem: null,
  stepFinishedCallback: null,
  // These are in milliseconds
  waitTimeToStart: 4000,
  waitTimeBetweenDownloads: 0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.obj(publicAPI, model);

  // Create get-set macros
  macro.setGet(publicAPI, model, ['baseUrl', 'files', 'mapper', 'sceneItem', 'stepFinishedCallback', 'waitTimeToStart', 'waitTimeBetweenDownloads']);
  macro.get(publicAPI, model, ['currentSource']);

  // Object specific methods
  vtkHttpDataSetLODsLoader(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkHttpDataSetLODsLoader');

// ----------------------------------------------------------------------------

var vtkHttpDataSetLODsLoader$1 = {
  newInstance,
  extend
};

export { vtkHttpDataSetLODsLoader$1 as default, extend, newInstance };
