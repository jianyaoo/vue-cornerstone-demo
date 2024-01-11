import { m as macro } from '../../../macros2.js';

// ----------------------------------------------------------------------------

function vtkCornerMixin(publicAPI, model) {
  publicAPI.translate = (dx, dy, dz) => {
    const [x, y, z] = publicAPI.getCornerByReference();
    publicAPI.setCorner(x + dx, y + dy, z + dz);
  };
}

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  corner: [0, 0, 0]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGetArray(publicAPI, model, ['corner'], 3);
  vtkCornerMixin(publicAPI);
}

// ----------------------------------------------------------------------------

var corner = {
  extend
};

export { corner as default, extend };
