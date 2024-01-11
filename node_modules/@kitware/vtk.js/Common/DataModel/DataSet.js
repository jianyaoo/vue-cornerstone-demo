import { m as macro } from '../../macros2.js';
import vtk from '../../vtk.js';
import vtkDataSetAttributes from './DataSetAttributes.js';
import Constants from './DataSet/Constants.js';

// import vtkBoundingBox from '../BoundingBox';
// import * as vtkMath from '../../Core/Math';
//
// function getBounds(dataset) {
//   if (dataset.bounds) {
//     return dataset.bounds;
//   }
//   if (dataset.type && dataset[dataset.type]) {
//     const ds = dataset[dataset.type];
//     if (ds.bounds) {
//       return ds.bounds;
//     }
//     if (ds.Points && ds.Points.bounds) {
//       return ds.Points.bounds;
//     }

//     if (ds.Points && ds.Points.values) {
//       const array = ds.Points.values;
//       const bbox = [...vtkBoundingBox.INIT_BOUNDS];
//       const size = array.length;
//       const delta = ds.Points.numberOfComponents ? ds.Points.numberOfComponents : 3;
//       for (let idx = 0; idx < size; idx += delta) {
//         vtkBoundingBox.addPoint(bbox, array[idx * delta], array[(idx * delta) + 1], array[(idx * delta) + 2]);
//       }
//       ds.Points.bounds = bbox;
//       return ds.Points.bounds;
//     }
//   }
//   return vtkMath.createUninitializedBounds();
// }

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

const DATASET_FIELDS = ['pointData', 'cellData', 'fieldData'];

// ----------------------------------------------------------------------------
// vtkDataSet methods
// ----------------------------------------------------------------------------

function vtkDataSet(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkDataSet');

  // Add dataset attributes
  DATASET_FIELDS.forEach(fieldName => {
    if (!model[fieldName]) {
      model[fieldName] = vtkDataSetAttributes.newInstance();
    } else {
      model[fieldName] = vtk(model[fieldName]);
    }
  });
  const superShallowCopy = publicAPI.shallowCopy;
  publicAPI.shallowCopy = function (other) {
    let debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    superShallowCopy(other, debug);
    DATASET_FIELDS.forEach(fieldName => {
      model[fieldName] = vtkDataSetAttributes.newInstance();
      model[fieldName].shallowCopy(other.getReferenceByName(fieldName));
    });
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // pointData: null,
  // cellData: null,
  // fieldData: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, DATASET_FIELDS);

  // Object specific methods
  vtkDataSet(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkDataSet');

// ----------------------------------------------------------------------------

var vtkDataSet$1 = {
  newInstance,
  extend,
  ...Constants
};

export { vtkDataSet$1 as default, extend, newInstance };
