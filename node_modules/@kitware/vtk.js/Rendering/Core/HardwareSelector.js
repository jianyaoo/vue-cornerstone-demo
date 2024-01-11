import { m as macro } from '../../macros2.js';
import vtkDataSet from '../../Common/DataModel/DataSet.js';

const {
  FieldAssociations
} = vtkDataSet;

// ----------------------------------------------------------------------------
// vtkHardwareSelector methods
// ----------------------------------------------------------------------------

function vtkHardwareSelector(publicAPI, model) {
  model.classHierarchy.push('vtkHardwareSelector');

  // get the source data that is used for generating a selection. This
  // must be called at least once before calling generateSelection. In
  // raster based backends this method will capture the buffers. You can
  // call this once and then make multiple calls to generateSelection.
  publicAPI.getSourceDataAsync = async (renderer, fx1, fy1, fx2, fy2) => {};
  publicAPI.selectAsync = async (renderer, fx1, fy1, fx2, fy2) => {
    const srcData = await publicAPI.getSourceDataAsync(renderer, fx1, fy1, fx2, fy2);
    if (srcData) {
      return srcData.generateSelection(fx1, fy1, fx2, fy2);
    }
    return [];
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  fieldAssociation: FieldAssociations.FIELD_ASSOCIATION_CELLS,
  captureZValues: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['fieldAssociation', 'captureZValues']);

  // Object methods
  vtkHardwareSelector(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkHardwareSelector');

// ----------------------------------------------------------------------------

var vtkHardwareSelector$1 = {
  newInstance,
  extend
};

export { vtkHardwareSelector$1 as default, extend, newInstance };
