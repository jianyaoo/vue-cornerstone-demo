import { m as macro } from '../../../macros2.js';

/**
 * Scalar color mixin.
 * Scalar value [0, 1] references a color in the mapper LUT.
 * Not to be used in conjunction with `color3` mixin.
 * @see color3
 */

const DEFAULT_VALUES = {
  color: 0.5
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGet(publicAPI, model, ['color']);
}

// ----------------------------------------------------------------------------

var color = {
  extend
};

export { color as default, extend };
