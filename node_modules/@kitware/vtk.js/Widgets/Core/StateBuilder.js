import { m as macro } from '../../macros2.js';
import vtkWidgetState from './WidgetState.js';
import bounds from './StateBuilder/boundsMixin.js';
import color from './StateBuilder/colorMixin.js';
import color3 from './StateBuilder/color3Mixin.js';
import corner from './StateBuilder/cornerMixin.js';
import direction from './StateBuilder/directionMixin.js';
import manipulator from './StateBuilder/manipulatorMixin.js';
import name from './StateBuilder/nameMixin.js';
import orientation from './StateBuilder/orientationMixin.js';
import origin from './StateBuilder/originMixin.js';
import scale1 from './StateBuilder/scale1Mixin.js';
import scale3 from './StateBuilder/scale3Mixin.js';
import text from './StateBuilder/textMixin.js';
import visible from './StateBuilder/visibleMixin.js';
import shape from './StateBuilder/shapeMixin.js';

const {
  vtkErrorMacro
} = macro;

// ----------------------------------------------------------------------------
// Global type lookup map
// ----------------------------------------------------------------------------

const MIXINS = {
  bounds,
  color,
  color3,
  corner,
  direction,
  manipulator,
  name,
  orientation,
  origin,
  scale1,
  scale3,
  text,
  visible,
  shape
};

// ----------------------------------------------------------------------------

function newInstance(mixins, initialValues) {
  let publicAPI = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let model = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  let skipWidgetState = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (!skipWidgetState) {
    vtkWidgetState.extend(publicAPI, model, initialValues);
  }
  for (let i = 0; i < mixins.length; i++) {
    const mixin = MIXINS[mixins[i]];
    if (mixin) {
      mixin.extend(publicAPI, model, initialValues);
    } else {
      vtkErrorMacro('Invalid mixin name:', mixins[i]);
    }
  }
  macro.safeArrays(model);
  return Object.freeze(publicAPI);
}

// ----------------------------------------------------------------------------

class Builder {
  constructor() {
    this.publicAPI = {};
    this.model = {};
    vtkWidgetState.extend(this.publicAPI, this.model);
    // The root state should always have the bounds/placeWidget/widgetFactor
    bounds.extend(this.publicAPI, this.model);
  }

  /* eslint-disable no-shadow */
  addDynamicMixinState(_ref) {
    let {
      labels,
      mixins,
      name,
      initialValues
    } = _ref;
    const listName = `${name}List`;
    this.model[listName] = [];
    // Create new Instance method
    this.publicAPI[`add${macro.capitalize(name)}`] = values => {
      const instance = newInstance(mixins, {
        ...initialValues,
        ...values
      });
      this.publicAPI.bindState(instance, labels);
      this.model[listName].push(instance);
      this.publicAPI.modified();
      return instance;
    };
    this.publicAPI[`remove${macro.capitalize(name)}`] = instanceOrIndex => {
      let removeIndex = this.model[listName].indexOf(instanceOrIndex);
      if (removeIndex === -1 && instanceOrIndex < this.model[listName].length) {
        removeIndex = instanceOrIndex;
      }
      const instance = this.model[listName][removeIndex];
      if (instance) {
        this.publicAPI.unbindState(instance);
      }
      this.model[listName].splice(removeIndex, 1);
      this.publicAPI.modified();
    };
    this.publicAPI[`get${macro.capitalize(name)}List`] = () => this.model[listName].slice();
    this.publicAPI[`clear${macro.capitalize(name)}List`] = () => {
      while (this.model[listName].length) {
        const instance = this.model[listName].pop();
        if (instance) {
          this.publicAPI.unbindState(instance);
        }
      }
      this.publicAPI.modified();
    };
    return this;
  }
  addStateFromMixin(_ref2) {
    let {
      labels,
      mixins,
      name,
      initialValues
    } = _ref2;
    const instance = newInstance(mixins, initialValues);
    this.model[name] = instance;
    this.publicAPI.bindState(instance, labels);
    macro.setGet(this.publicAPI, this.model, [name]);
    return this;
  }
  addStateFromInstance(_ref3) {
    let {
      labels,
      name,
      instance
    } = _ref3;
    this.model[name] = instance;
    this.publicAPI.bindState(instance, labels);
    macro.setGet(this.publicAPI, this.model, [name]);
    return this;
  }
  addField(_ref4) {
    let {
      name,
      initialValue
    } = _ref4;
    if (Array.isArray(initialValue)) {
      macro.setGetArray(this.publicAPI, this.model, [name], initialValue.length);
    } else {
      macro.setGet(this.publicAPI, this.model, [name]);
    }
    this.model[name] = initialValue;
    return this;
  }
  build() {
    for (var _len = arguments.length, mixins = new Array(_len), _key = 0; _key < _len; _key++) {
      mixins[_key] = arguments[_key];
    }
    return newInstance(mixins, {}, this.publicAPI, this.model, true);
  }
}

// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------

function createBuilder() {
  return new Builder();
}
var vtkStateBuilder = {
  createBuilder
};

export { createBuilder, vtkStateBuilder as default };
