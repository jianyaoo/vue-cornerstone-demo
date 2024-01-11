import { m as macro } from '../../macros2.js';

// ----------------------------------------------------------------------------
// vtkVariantArray methods
// ----------------------------------------------------------------------------

function vtkVariantArray(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkVariantArray');

  // Description:
  // Return the data component at the location specified by tupleIdx and
  // compIdx.
  publicAPI.getComponent = function (tupleIdx) {
    let compIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return model.values[tupleIdx * model.numberOfComponents + compIdx];
  };

  // Description:
  // Set the data component at the location specified by tupleIdx and compIdx
  // to value.
  // Note that i is less than NumberOfTuples and j is less than
  //  NumberOfComponents. Make sure enough memory has been allocated
  // (use SetNumberOfTuples() and SetNumberOfComponents()).
  publicAPI.setComponent = (tupleIdx, compIdx, value) => {
    if (value !== model.values[tupleIdx * model.numberOfComponents + compIdx]) {
      model.values[tupleIdx * model.numberOfComponents + compIdx] = value;
      publicAPI.modified();
    }
  };
  publicAPI.getData = () => model.values;
  publicAPI.getTuple = function (idx) {
    let tupleToFill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    const numberOfComponents = model.numberOfComponents || 1;
    if (tupleToFill.length) {
      tupleToFill.length = numberOfComponents;
    }
    const offset = idx * numberOfComponents;
    for (let i = 0; i < numberOfComponents; i++) {
      tupleToFill[i] = model.values[offset + i];
    }
    return tupleToFill;
  };
  publicAPI.getTupleLocation = function () {
    let idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return idx * model.numberOfComponents;
  };
  publicAPI.getNumberOfComponents = () => model.numberOfComponents;
  publicAPI.getNumberOfValues = () => model.values.length;
  publicAPI.getNumberOfTuples = () => model.values.length / model.numberOfComponents;
  publicAPI.getDataType = () => model.dataType;
  /* eslint-disable no-use-before-define */
  publicAPI.newClone = () => newInstance({
    name: model.name,
    numberOfComponents: model.numberOfComponents
  });
  /* eslint-enable no-use-before-define */

  publicAPI.getName = () => {
    if (!model.name) {
      publicAPI.modified();
      model.name = `vtkVariantArray${publicAPI.getMTime()}`;
    }
    return model.name;
  };
  publicAPI.setData = (array, numberOfComponents) => {
    model.values = array;
    model.size = array.length;
    if (numberOfComponents) {
      model.numberOfComponents = numberOfComponents;
    }
    if (model.size % model.numberOfComponents !== 0) {
      model.numberOfComponents = 1;
    }
    publicAPI.modified();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  name: '',
  numberOfComponents: 1,
  size: 0,
  // values: null,
  dataType: 'JSON'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  if (!model.empty && !model.values && !model.size) {
    throw new TypeError('Cannot create vtkVariantArray object without: size > 0, values');
  }
  if (!model.values) {
    model.values = [];
  } else if (Array.isArray(model.values)) {
    model.values = [...model.values];
  }
  if (model.values) {
    model.size = model.values.length;
  }

  // Object methods
  macro.obj(publicAPI, model);
  macro.set(publicAPI, model, ['name']);

  // Object specific methods
  vtkVariantArray(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkVariantArray');

// ----------------------------------------------------------------------------

var vtkVariantArray$1 = {
  newInstance,
  extend
};

export { vtkVariantArray$1 as default, extend, newInstance };
