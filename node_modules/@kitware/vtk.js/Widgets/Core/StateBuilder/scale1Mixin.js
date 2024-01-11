import { m as macro } from '../../../macros2.js';

const DEFAULT_VALUES = {
  scale1: 0.5
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGet(publicAPI, model, ['scale1']);
}

// ----------------------------------------------------------------------------

var scale1 = {
  extend
};

export { scale1 as default, extend };
