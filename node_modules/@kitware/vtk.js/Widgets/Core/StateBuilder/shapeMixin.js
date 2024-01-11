import { m as macro } from '../../../macros2.js';

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  shape: ''
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGet(publicAPI, model, ['shape']);
}

// ----------------------------------------------------------------------------

var shape = {
  extend
};

export { shape as default, extend };
