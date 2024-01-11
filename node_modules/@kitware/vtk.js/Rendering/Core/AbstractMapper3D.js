import { m as macro } from '../../macros2.js';
import vtkAbstractMapper from './AbstractMapper.js';
import vtkBoundingBox from '../../Common/DataModel/BoundingBox.js';
import { F as createUninitializedBounds } from '../../Common/Core/Math/index.js';

// ----------------------------------------------------------------------------
// vtkAbstractMapper methods
// ----------------------------------------------------------------------------

function vtkAbstractMapper3D(publicAPI, model) {
  publicAPI.getBounds = () => {
    macro.vtkErrorMacro(`vtkAbstractMapper3D.getBounds - NOT IMPLEMENTED`);
    return createUninitializedBounds();
  };
  publicAPI.getCenter = () => {
    const bounds = publicAPI.getBounds();
    model.center = vtkBoundingBox.isValid(bounds) ? vtkBoundingBox.getCenter(bounds) : null;
    return model.center?.slice();
  };
  publicAPI.getLength = () => {
    const bounds = publicAPI.getBounds();
    return vtkBoundingBox.getDiagonalLength(bounds);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const defaultValues = initialValues => ({
  bounds: [...vtkBoundingBox.INIT_BOUNDS],
  center: [0, 0, 0],
  viewSpecificProperties: {},
  ...initialValues
});

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, defaultValues(initialValues));
  // Inheritance
  vtkAbstractMapper.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['viewSpecificProperties']);
  vtkAbstractMapper3D(publicAPI, model);
}

// ----------------------------------------------------------------------------

var vtkAbstractMapper3D$1 = {
  extend
};

export { vtkAbstractMapper3D$1 as default, extend };
