import { m as macro } from '../../../macros2.js';
import vtkDataArray from '../../../Common/Core/DataArray.js';
import vtkCellArray from '../../../Common/Core/CellArray.js';
import vtkPoints from '../../../Common/Core/Points.js';

const FACTORY = {
  vtkDataArray,
  vtkCellArray,
  vtkPoints
};
function createDefaultTypedArrayHandler() {
  const arrays = [];
  function write(array) {
    const id = arrays.length;
    arrays.push(array);
    return id;
  }
  function read(arrayId) {
    return arrays[arrayId];
  }
  return {
    write,
    read,
    arrays
  };
}
function vtkArraySerializer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkArraySerializer');
  if (!model.typedArrayHandler) {
    model.typedArrayHandler = createDefaultTypedArrayHandler();
  }
  publicAPI.serialize = obj => {
    const name = obj.getName();
    const numberOfTuples = obj.getNumberOfTuples();
    const vtkClass = obj.getClassName();
    const rawData = obj.getData();
    return {
      id: model.typedArrayHandler.write(rawData),
      name,
      numberOfTuples,
      vtkClass
    };
  };
  publicAPI.deserialize = obj => {
    const values = model.typedArrayHandler.read(obj.id);
    const {
      name,
      numberOfTuples
    } = obj;
    return FACTORY[obj.vtkClass].newInstance({
      name,
      numberOfTuples,
      values
    });
  };
}

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, initialValues);
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['typedArrayHandler']);

  // Object specific methods
  vtkArraySerializer(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkArraySerializer');

// ----------------------------------------------------------------------------

var vtkArraySerializer$1 = {
  newInstance,
  extend
};

export { vtkArraySerializer$1 as default, extend, newInstance };
