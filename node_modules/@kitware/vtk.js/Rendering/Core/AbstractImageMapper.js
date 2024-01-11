import { m as macro } from '../../macros2.js';
import vtkAbstractMapper3D from './AbstractMapper3D.js';
import { F as createUninitializedBounds } from '../../Common/Core/Math/index.js';

// ----------------------------------------------------------------------------
// vtkAbstractImageMapper methods
// ----------------------------------------------------------------------------

function vtkAbstractImageMapper(publicAPI, model) {
  model.classHierarchy.push('vtkAbstractImageMapper');
  publicAPI.getIsOpaque = () => true;
  publicAPI.getCurrentImage = () => null;
  publicAPI.getBoundsForSlice = () => {
    macro.vtkErrorMacro('vtkAbstractImageMapper.getBoundsForSlice - NOT IMPLEMENTED');
    return createUninitializedBounds();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  slice: 0,
  customDisplayExtent: [0, 0, 0, 0, 0, 0],
  useCustomExtents: false,
  backgroundColor: [0, 0, 0, 1]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  vtkAbstractMapper3D.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['slice', 'useCustomExtents']);
  macro.setGetArray(publicAPI, model, ['customDisplayExtent'], 6);
  macro.setGetArray(publicAPI, model, ['backgroundColor'], 4);
  vtkAbstractImageMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------
var vtkAbstractImageMapper$1 = {
  extend
};

export { vtkAbstractImageMapper$1 as default, extend };
