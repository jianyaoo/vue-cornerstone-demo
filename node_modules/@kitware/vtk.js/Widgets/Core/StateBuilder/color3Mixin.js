import { m as macro } from '../../../macros2.js';

/**
 * RGB Uint8 color mixin. Not to be used in conjunction with `color` mixin.
 * @see color
 */
const DEFAULT_VALUES = {
  color3: [255, 255, 255],
  opacity: 255
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);
  macro.setGetArray(publicAPI, model, ['color3'], 3, 255);
  macro.setGet(publicAPI, model, ['opacity']);
}

// ----------------------------------------------------------------------------

var color3 = {
  extend
};

export { color3 as default, extend };
