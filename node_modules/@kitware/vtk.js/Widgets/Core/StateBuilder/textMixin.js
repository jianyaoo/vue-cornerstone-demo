import { m as macro } from '../../../macros2.js';

const DEFAULT_VALUES = {
  text: 'DefaultText'
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGet(publicAPI, model, ['text']);
}

// ----------------------------------------------------------------------------

var text = {
  extend
};

export { text as default, extend };
