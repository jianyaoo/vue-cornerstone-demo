import { m as macro } from '../../macros2.js';
import vtkColorMaps from '../../Rendering/Core/ColorTransferFunction/ColorMaps.js';
import vtkColorTransferFunction from '../../Rendering/Core/ColorTransferFunction.js';
import Constants from './LookupTableProxy/Constants.js';

const {
  Mode,
  Defaults
} = Constants;

// ----------------------------------------------------------------------------
// vtkLookupTableProxy methods
// ----------------------------------------------------------------------------

function vtkLookupTableProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLookupTableProxy');
  model.lookupTable = model.lookupTable || vtkColorTransferFunction.newInstance();

  // Initialize lookup table
  model.lookupTable.setVectorModeToMagnitude();

  // Takes a preset colormap name
  publicAPI.setPresetName = presetName => {
    if (model.presetName !== presetName) {
      model.presetName = presetName;
      model.mode = Mode.Preset;
      publicAPI.applyMode();
    }
  };

  // Takes an array of points [x, r, g, b, m=0.5, s=0.0]
  publicAPI.setRGBPoints = rgbPoints => {
    if (model.rgbPoints !== rgbPoints) {
      model.rgbPoints = (rgbPoints || Defaults.RGBPoints).slice();
      publicAPI.applyMode();
    }
  };

  // Takes an array of points [x, h, s, v, m=0.5, s=0.0]
  publicAPI.setHSVPoints = hsvPoints => {
    if (model.hsvPoints !== hsvPoints) {
      model.hsvPoints = (hsvPoints || Defaults.HSVPoints).slice();
      publicAPI.applyMode();
    }
  };

  // Takes an array of ColorTransferFunction nodes
  publicAPI.setNodes = nodes => {
    if (model.nodes !== nodes) {
      model.nodes = (nodes || Defaults.Nodes).slice();
      publicAPI.applyMode();
    }
  };
  publicAPI.setMode = mode => {
    if (model.mode !== mode) {
      model.mode = mode;
      publicAPI.applyMode();
    }
  };
  publicAPI.applyMode = () => {
    switch (model.mode) {
      case Mode.Preset:
        {
          const preset = vtkColorMaps.getPresetByName(model.presetName);
          if (preset) {
            model.lookupTable.applyColorMap(preset);
          }
        }
        break;
      case Mode.RGBPoints:
        model.lookupTable.removeAllPoints();
        model.rgbPoints.forEach(point => model.lookupTable.addRGBPointLong(...point));
        break;
      case Mode.HSVPoints:
        model.lookupTable.removeAllPoints();
        model.hsvPoints.forEach(point => model.lookupTable.addHSVPointLong(...point));
        break;
      case Mode.Nodes:
        model.lookupTable.setNodes(model.nodes);
        break;
      // noop
    }

    model.lookupTable.setMappingRange(model.dataRange[0], model.dataRange[1]);
    model.lookupTable.updateRange();
    publicAPI.modified();
  };
  publicAPI.setDataRange = (min, max) => {
    if (model.dataRange[0] !== min || model.dataRange[1] !== max) {
      model.dataRange[0] = min;
      model.dataRange[1] = max;
      model.lookupTable.setMappingRange(model.dataRange[0], model.dataRange[1]);
      model.lookupTable.updateRange();
      publicAPI.applyMode();
    }
  };

  // Initialization ------------------------------------------------------------

  publicAPI.applyMode();
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  mode: Mode.Preset,
  presetName: Defaults.Preset,
  rgbPoints: Defaults.RGBPoints,
  hsvPoints: Defaults.HSVPoints,
  nodes: Defaults.Nodes,
  arrayName: 'No array associated',
  arrayLocation: 'pointData',
  dataRange: [0, 1]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['arrayName']);
  macro.get(publicAPI, model, ['mode', 'lookupTable', 'presetName', 'rgbPoints', 'hsvPoints', 'nodes', 'dataRange']);

  // Object specific methods
  vtkLookupTableProxy(publicAPI, model);

  // Proxy handling
  macro.proxy(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkLookupTableProxy');
var vtkLookupTableProxy$1 = {
  newInstance,
  extend,
  Mode,
  Defaults
};

export { Mode, vtkLookupTableProxy$1 as default, newInstance };
