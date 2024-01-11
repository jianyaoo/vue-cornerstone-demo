import { m as macro } from '../../macros2.js';
import vtkDataArray from './DataArray.js';
import { VtkDataTypes } from './DataArray/Constants.js';

const {
  vtkErrorMacro
} = macro;
const INVALID_BOUNDS = [1, -1, 1, -1, 1, -1];

// ----------------------------------------------------------------------------
// vtkPoints methods
// ----------------------------------------------------------------------------

function vtkPoints(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPoints');

  // Forwarding methods
  publicAPI.getNumberOfPoints = publicAPI.getNumberOfTuples;
  publicAPI.setNumberOfPoints = function (nbPoints) {
    let dimension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
    if (publicAPI.getNumberOfPoints() !== nbPoints) {
      model.size = nbPoints * dimension;
      model.values = macro.newTypedArray(model.dataType, model.size);
      publicAPI.setNumberOfComponents(dimension);
      publicAPI.modified();
    }
  };
  publicAPI.setPoint = function (idx) {
    for (var _len = arguments.length, xyz = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      xyz[_key - 1] = arguments[_key];
    }
    publicAPI.setTuple(idx, xyz);
  };
  publicAPI.getPoint = publicAPI.getTuple;
  publicAPI.findPoint = publicAPI.findTuple;
  publicAPI.insertNextPoint = (x, y, z) => publicAPI.insertNextTuple([x, y, z]);
  publicAPI.getBounds = () => {
    if (publicAPI.getNumberOfComponents() === 3) {
      const xRange = publicAPI.getRange(0);
      model.bounds[0] = xRange[0];
      model.bounds[1] = xRange[1];
      const yRange = publicAPI.getRange(1);
      model.bounds[2] = yRange[0];
      model.bounds[3] = yRange[1];
      const zRange = publicAPI.getRange(2);
      model.bounds[4] = zRange[0];
      model.bounds[5] = zRange[1];
      return model.bounds;
    }
    if (publicAPI.getNumberOfComponents() !== 2) {
      vtkErrorMacro(`getBounds called on an array with components of
        ${publicAPI.getNumberOfComponents()}`);
      return INVALID_BOUNDS;
    }
    const xRange = publicAPI.getRange(0);
    model.bounds[0] = xRange[0];
    model.bounds[1] = xRange[1];
    const yRange = publicAPI.getRange(1);
    model.bounds[2] = yRange[0];
    model.bounds[3] = yRange[1];
    model.bounds[4] = 0;
    model.bounds[5] = 0;
    return model.bounds;
  };

  // Trigger the computation of bounds
  publicAPI.computeBounds = publicAPI.getBounds;

  // Initialize
  publicAPI.setNumberOfComponents(model.numberOfComponents < 2 ? 3 : model.numberOfComponents);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  empty: true,
  numberOfComponents: 3,
  dataType: VtkDataTypes.FLOAT,
  bounds: [1, -1, 1, -1, 1, -1]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  vtkDataArray.extend(publicAPI, model, initialValues);
  vtkPoints(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkPoints');

// ----------------------------------------------------------------------------

var vtkPoints$1 = {
  newInstance,
  extend
};

export { vtkPoints$1 as default, extend, newInstance };
