import { m as macro } from '../../macros2.js';
import vtkDataArray from './DataArray.js';
import { VtkDataTypes } from './DataArray/Constants.js';

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

function extractCellSizes(cellArray) {
  let currentIdx = 0;
  return cellArray.filter((value, index) => {
    if (index === currentIdx) {
      currentIdx += value + 1;
      return true;
    }
    return false;
  });
}
function getNumberOfCells(cellArray) {
  let cellId = 0;
  for (let cellArrayIndex = 0; cellArrayIndex < cellArray.length;) {
    cellArrayIndex += cellArray[cellArrayIndex] + 1;
    cellId++;
  }
  return cellId;
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

const STATIC = {
  extractCellSizes,
  getNumberOfCells
};

// ----------------------------------------------------------------------------
// vtkCellArray methods
// ----------------------------------------------------------------------------

function vtkCellArray(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCellArray');
  const superClass = {
    ...publicAPI
  };
  publicAPI.getNumberOfCells = recompute => {
    if (model.numberOfCells !== undefined && !recompute) {
      return model.numberOfCells;
    }
    if (model.cellSizes) {
      model.numberOfCells = model.cellSizes.length;
    } else {
      model.numberOfCells = getNumberOfCells(publicAPI.getData());
    }
    return model.numberOfCells;
  };
  publicAPI.getCellSizes = recompute => {
    if (model.cellSizes !== undefined && !recompute) {
      return model.cellSizes;
    }
    model.cellSizes = extractCellSizes(publicAPI.getData());
    return model.cellSizes;
  };

  /**
   * When `resize()` is being used, you then MUST use `insertNextCell()`.
   */
  publicAPI.resize = requestedNumTuples => {
    const oldNumTuples = publicAPI.getNumberOfTuples();
    superClass.resize(requestedNumTuples);
    const newNumTuples = publicAPI.getNumberOfTuples();
    if (newNumTuples < oldNumTuples) {
      if (newNumTuples === 0) {
        model.numberOfCells = 0;
        model.cellSizes = [];
      } else {
        // We do not know how many cells are left.
        // Set to undefined to ensure insertNextCell works correctly.
        model.numberOfCells = undefined;
        model.cellSizes = undefined;
      }
    }
  };
  publicAPI.setData = typedArray => {
    superClass.setData(typedArray, 1);
    model.numberOfCells = undefined;
    model.cellSizes = undefined;
  };
  publicAPI.getCell = loc => {
    let cellLoc = loc;
    const numberOfPoints = model.values[cellLoc++];
    return model.values.subarray(cellLoc, cellLoc + numberOfPoints);
  };
  publicAPI.insertNextCell = cellPointIds => {
    const cellId = publicAPI.getNumberOfCells();
    publicAPI.insertNextTuples([cellPointIds.length, ...cellPointIds]);
    // By computing the number of cells earlier, we made sure that numberOfCells is defined
    ++model.numberOfCells;
    if (model.cellSizes != null) {
      model.cellSizes.push(cellPointIds.length);
    }
    return cellId;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

function defaultValues(initialValues) {
  return {
    empty: true,
    numberOfComponents: 1,
    dataType: VtkDataTypes.UNSIGNED_INT,
    ...initialValues
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  vtkDataArray.extend(publicAPI, model, defaultValues(initialValues));
  vtkCellArray(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkCellArray');

// ----------------------------------------------------------------------------

var vtkCellArray$1 = {
  newInstance,
  extend,
  ...STATIC
};

export { STATIC, vtkCellArray$1 as default, extend, newInstance };
