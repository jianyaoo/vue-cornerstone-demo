import { m as macro } from '../../macros2.js';
import vtkPiecewiseFunction from '../../Common/DataModel/PiecewiseFunction.js';
import vtkPiecewiseGaussianWidget from '../../Interaction/Widgets/PiecewiseGaussianWidget.js';
import Constants from './PiecewiseFunctionProxy/Constants.js';

const {
  Mode,
  Defaults
} = Constants;

// ----------------------------------------------------------------------------

function applyPointsToPiecewiseFunction(points, range, pwf) {
  const width = range[1] - range[0];
  const rescaled = points.map(_ref => {
    let [x, y] = _ref;
    return [x * width + range[0], y];
  });
  pwf.removeAllPoints();
  rescaled.forEach(_ref2 => {
    let [x, y] = _ref2;
    return pwf.addPoint(x, y);
  });
}

// ----------------------------------------------------------------------------

function applyNodesToPiecewiseFunction(nodes, range, pwf) {
  const width = range[1] - range[0];
  const rescaled = nodes.map(n => ({
    ...n,
    x: n.x * width + range[0]
  }));
  pwf.setNodes(rescaled);
}

// ----------------------------------------------------------------------------

function copyGaussians(gaussians) {
  // gaussians is assumed to be an array of gaussian objects
  return gaussians.map(g => ({
    ...g
  }));
}

// ----------------------------------------------------------------------------
// vtkPiecewiseFunctionProxy methods
// ----------------------------------------------------------------------------

function vtkPiecewiseFunctionProxy(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPiecewiseFunctionProxy');
  model.piecewiseFunction = model.piecewiseFunction || vtkPiecewiseFunction.newInstance();

  // Takes an array of gaussians
  publicAPI.setGaussians = gaussians => {
    model.gaussians = copyGaussians(gaussians || []);
    if (model.gaussians.length === 0) {
      model.gaussians = copyGaussians(Defaults.Gaussians);
    }
    publicAPI.applyMode();
  };

  // Takes an array of points [x, y]
  publicAPI.setPoints = points => {
    model.points = (points || []).slice();
    if (model.points.length === 0) {
      model.points = Defaults.Points.slice();
    }
    publicAPI.applyMode();
  };

  // Takes an array of PiecewiseFunction nodes
  publicAPI.setNodes = nodes => {
    model.nodes = (nodes || []).slice();
    if (model.nodes.length === 0) {
      model.nodes = Defaults.Nodes.slice();
    }
    publicAPI.applyMode();
  };
  publicAPI.setMode = mode => {
    if (model.mode === mode) {
      return;
    }
    model.mode = mode;
    publicAPI.applyMode();
  };
  publicAPI.applyMode = () => {
    switch (model.mode) {
      case Mode.Gaussians:
        vtkPiecewiseGaussianWidget.applyGaussianToPiecewiseFunction(model.gaussians, 255, model.dataRange, model.piecewiseFunction);
        publicAPI.modified();
        break;
      case Mode.Points:
        applyPointsToPiecewiseFunction(model.points, model.dataRange, model.piecewiseFunction);
        publicAPI.modified();
        break;
      case Mode.Nodes:
        applyNodesToPiecewiseFunction(model.nodes, model.dataRange, model.piecewiseFunction);
        publicAPI.modified();
        break;
      // noop
    }
  };

  publicAPI.getLookupTableProxy = () => model.proxyManager.getLookupTable(model.arrayName);
  publicAPI.setDataRange = (min, max) => {
    if (model.dataRange[0] !== min || model.dataRange[1] !== max) {
      model.dataRange[0] = min;
      model.dataRange[1] = max;
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
  mode: Mode.Gaussians,
  gaussians: Defaults.Gaussians,
  points: Defaults.Points,
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
  macro.get(publicAPI, model, ['piecewiseFunction', 'gaussians', 'nodes', 'points', 'mode', 'dataRange']);

  // Object specific methods
  vtkPiecewiseFunctionProxy(publicAPI, model);

  // Proxy handling
  macro.proxy(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPiecewiseFunctionProxy');

// ----------------------------------------------------------------------------

var vtkPiecewiseFunctionProxy$1 = {
  newInstance,
  extend,
  Mode,
  Defaults
};

export { vtkPiecewiseFunctionProxy$1 as default, newInstance };
