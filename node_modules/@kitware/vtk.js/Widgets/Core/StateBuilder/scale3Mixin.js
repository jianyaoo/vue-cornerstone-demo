import { m as macro } from '../../../macros2.js';

const DEFAULT_VALUES = {
  scale3: [1, 1, 1]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGetArray(publicAPI, model, ['scale3'], 3);
}

// ----------------------------------------------------------------------------

var scale3 = {
  extend
};

export { scale3 as default, extend };
