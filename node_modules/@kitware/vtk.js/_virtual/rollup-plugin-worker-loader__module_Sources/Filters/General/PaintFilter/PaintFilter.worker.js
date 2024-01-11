import { c as createInlineWorkerFactory } from '../../../../rollup-plugin-web-worker-loader__helper__browser__createInlineWorkerFactory.js';

var WorkerFactory = createInlineWorkerFactory(/* rollup-plugin-web-worker-loader */function () {
(function () {
  '__worker_loader_strict__';

  var register = {exports: {}};

  var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var TinyEmitter$1 = function () {
    function TinyEmitter() {
      _classCallCheck$1(this, TinyEmitter);

      Object.defineProperty(this, '__listeners', {
        value: {},
        enumerable: false,
        writable: false
      });
    }

    _createClass$1(TinyEmitter, [{
      key: 'emit',
      value: function emit(eventName) {
        if (!this.__listeners[eventName]) return this;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.__listeners[eventName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var handler = _step.value;

            handler.apply(undefined, args);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return this;
      }
    }, {
      key: 'once',
      value: function once(eventName, handler) {
        var _this = this;

        var once = function once() {
          _this.off(eventName, once);
          handler.apply(undefined, arguments);
        };

        return this.on(eventName, once);
      }
    }, {
      key: 'on',
      value: function on(eventName, handler) {
        if (!this.__listeners[eventName]) this.__listeners[eventName] = [];

        this.__listeners[eventName].push(handler);

        return this;
      }
    }, {
      key: 'off',
      value: function off(eventName, handler) {
        if (handler) this.__listeners[eventName] = this.__listeners[eventName].filter(function (h) {
          return h !== handler;
        });else this.__listeners[eventName] = [];

        return this;
      }
    }]);

    return TinyEmitter;
  }();

  var tinyEmitter = TinyEmitter$1;

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var TinyEmitter = tinyEmitter;

  var MESSAGE_RESULT = 0;
  var MESSAGE_EVENT = 1;

  var RESULT_ERROR = 0;
  var RESULT_SUCCESS = 1;

  var DEFAULT_HANDLER = 'main';

  var isPromise = function isPromise(o) {
    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null && typeof o.then === 'function' && typeof o.catch === 'function';
  };

  function RegisterPromise(fn) {
    var handlers = _defineProperty({}, DEFAULT_HANDLER, fn);
    var sendPostMessage = self.postMessage.bind(self);

    var server = new (function (_TinyEmitter) {
      _inherits(WorkerRegister, _TinyEmitter);

      function WorkerRegister() {
        _classCallCheck(this, WorkerRegister);

        return _possibleConstructorReturn(this, (WorkerRegister.__proto__ || Object.getPrototypeOf(WorkerRegister)).apply(this, arguments));
      }

      _createClass(WorkerRegister, [{
        key: 'emit',
        value: function emit(eventName) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          if (args.length == 1 && args[0] instanceof TransferableResponse) {
            sendPostMessage({ eventName: eventName, args: args }, args[0].transferable);
          } else {
            sendPostMessage({ eventName: eventName, args: args });
          }
          return this;
        }
      }, {
        key: 'emitLocally',
        value: function emitLocally(eventName) {
          var _get2;

          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          (_get2 = _get(WorkerRegister.prototype.__proto__ || Object.getPrototypeOf(WorkerRegister.prototype), 'emit', this)).call.apply(_get2, [this, eventName].concat(args));
        }
      }, {
        key: 'operation',
        value: function operation(name, handler) {
          handlers[name] = handler;
          return this;
        }
      }]);

      return WorkerRegister;
    }(TinyEmitter))();

    var run = function run(messageId, payload, handlerName) {

      var onSuccess = function onSuccess(result) {
        if (result && result instanceof TransferableResponse) {
          sendResult(messageId, RESULT_SUCCESS, result.payload, result.transferable);
        } else {
          sendResult(messageId, RESULT_SUCCESS, result);
        }
      };

      var onError = function onError(e) {
        sendResult(messageId, RESULT_ERROR, {
          message: e.message,
          stack: e.stack
        });
      };

      try {
        var result = runFn(messageId, payload, handlerName);
        if (isPromise(result)) {
          result.then(onSuccess).catch(onError);
        } else {
          onSuccess(result);
        }
      } catch (e) {
        onError(e);
      }
    };

    var runFn = function runFn(messageId, payload, handlerName) {
      var handler = handlers[handlerName || DEFAULT_HANDLER];
      if (!handler) throw new Error('Not found handler for this request');

      return handler(payload, sendEvent.bind(null, messageId));
    };

    var sendResult = function sendResult(messageId, success, payload) {
      var transferable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      sendPostMessage([MESSAGE_RESULT, messageId, success, payload], transferable);
    };

    var sendEvent = function sendEvent(messageId, eventName, payload) {
      if (!eventName) throw new Error('eventName is required');

      if (typeof eventName !== 'string') throw new Error('eventName should be string');

      sendPostMessage([MESSAGE_EVENT, messageId, eventName, payload]);
    };

    self.addEventListener('message', function (_ref) {
      var data = _ref.data;

      if (Array.isArray(data)) {
        run.apply(undefined, _toConsumableArray(data));
      } else if (data && data.eventName) {
        server.emitLocally.apply(server, [data.eventName].concat(_toConsumableArray(data.args)));
      }
    });

    return server;
  }

  var TransferableResponse = function TransferableResponse(payload, transferable) {
    _classCallCheck(this, TransferableResponse);

    this.payload = payload;
    this.transferable = transferable;
  };

  register.exports = RegisterPromise;
  register.exports.TransferableResponse = TransferableResponse;

  var registerWebworker = register.exports;

  const SlicingMode = {
    NONE: -1,
    I: 0,
    J: 1,
    K: 2,
    X: 3,
    Y: 4,
    Z: 5
  };

  /**
   * Common utilities
   * @module glMatrix
   */
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Subtracts vector b from vector a
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */

  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  /**
   * Scales a vec3 by a scalar number
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec3} out
   */

  function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @returns {vec3} out
   */

  function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    out[2] = a[2] + b[2] * scale;
    return out;
  }
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  (function () {
    var vec = create();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  })();

  const globals = {
    // single-component labelmap
    buffer: null,
    dimensions: [0, 0, 0],
    prevPoint: null,
    slicingMode: null // 2D or 3D painting
  };

  // --------------------------------------------------------------------------

  function handlePaintRectangle(_ref) {
    let {
      point1,
      point2
    } = _ref;
    const [x1, y1, z1] = point1;
    const [x2, y2, z2] = point2;
    const xstart = Math.max(Math.min(x1, x2), 0);
    const xend = Math.min(Math.max(x1, x2), globals.dimensions[0] - 1);
    if (xstart <= xend) {
      const ystart = Math.max(Math.min(y1, y2), 0);
      const yend = Math.min(Math.max(y1, y2), globals.dimensions[1] - 1);
      const zstart = Math.max(Math.min(z1, z2), 0);
      const zend = Math.min(Math.max(z1, z2), globals.dimensions[2] - 1);
      const jStride = globals.dimensions[0];
      const kStride = globals.dimensions[0] * globals.dimensions[1];
      for (let k = zstart; k <= zend; k++) {
        for (let j = ystart; j <= yend; j++) {
          const index = j * jStride + k * kStride;
          globals.buffer.fill(1, index + xstart, index + xend + 1);
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // center and scale3 are in IJK coordinates
  function handlePaintEllipse(_ref2) {
    let {
      center,
      scale3
    } = _ref2;
    const radius3 = [...scale3];
    const indexCenter = center.map(val => Math.round(val));
    let sliceAxis = -1;
    if (globals.slicingMode != null && globals.slicingMode !== SlicingMode.NONE) {
      sliceAxis = globals.slicingMode % 3;
    }
    const yStride = globals.dimensions[0];
    const zStride = globals.dimensions[0] * globals.dimensions[1];
    let [xmin, ymin, zmin] = indexCenter;
    let [xmax, ymax, zmax] = indexCenter;
    if (sliceAxis !== 2) {
      zmin = Math.round(Math.max(indexCenter[2] - radius3[2], 0));
      zmax = Math.round(Math.min(indexCenter[2] + radius3[2], globals.dimensions[2] - 1));
    }
    for (let z = zmin; z <= zmax; z++) {
      let dz = 0;
      if (sliceAxis !== 2) {
        dz = (indexCenter[2] - z) / radius3[2];
      }
      const dzSquared = dz * dz;
      if (dzSquared <= 1) {
        const ay = radius3[1] * Math.sqrt(1 - dzSquared);
        if (sliceAxis !== 1) {
          ymin = Math.round(Math.max(indexCenter[1] - ay, 0));
          ymax = Math.round(Math.min(indexCenter[1] + ay, globals.dimensions[1] - 1));
        }
        for (let y = ymin; y <= ymax; y++) {
          let dy = 0;
          if (sliceAxis !== 1) {
            dy = (indexCenter[1] - y) / radius3[1];
          }
          const dySquared = dy * dy;
          if (dySquared + dzSquared <= 1) {
            if (sliceAxis !== 0) {
              const ax = radius3[0] * Math.sqrt(1 - dySquared - dzSquared);
              xmin = Math.round(Math.max(indexCenter[0] - ax, 0));
              xmax = Math.round(Math.min(indexCenter[0] + ax, globals.dimensions[0] - 1));
            }
            if (xmin <= xmax) {
              const index = y * yStride + z * zStride;
              globals.buffer.fill(1, index + xmin, index + xmax + 1);
            }
          }
        }
      }
    }
  }

  // --------------------------------------------------------------------------

  function handlePaint(_ref3) {
    let {
      point,
      radius
    } = _ref3;
    if (!globals.prevPoint) {
      globals.prevPoint = point;
    }

    // DDA params
    const delta = [point[0] - globals.prevPoint[0], point[1] - globals.prevPoint[1], point[2] - globals.prevPoint[2]];
    const inc = [1, 1, 1];
    for (let i = 0; i < 3; i++) {
      if (delta[i] < 0) {
        delta[i] = -delta[i];
        inc[i] = -1;
      }
    }
    const step = Math.max(...delta);

    // DDA
    const thresh = [step, step, step];
    const pt = [...globals.prevPoint];
    for (let s = 0; s <= step; s++) {
      handlePaintEllipse({
        center: pt,
        scale3: radius
      });
      for (let ii = 0; ii < 3; ii++) {
        thresh[ii] -= delta[ii];
        if (thresh[ii] <= 0) {
          thresh[ii] += step;
          pt[ii] += inc[ii];
        }
      }
    }
    globals.prevPoint = point;
  }

  // --------------------------------------------------------------------------

  function handlePaintTriangles(_ref4) {
    let {
      triangleList
    } = _ref4;
    // debugger;

    const triangleCount = Math.floor(triangleList.length / 9);
    for (let i = 0; i < triangleCount; i++) {
      const point0 = triangleList.subarray(9 * i + 0, 9 * i + 3);
      const point1 = triangleList.subarray(9 * i + 3, 9 * i + 6);
      const point2 = triangleList.subarray(9 * i + 6, 9 * i + 9);
      const v1 = [0, 0, 0];
      const v2 = [0, 0, 0];
      subtract(v1, point1, point0);
      subtract(v2, point2, point0);
      const step1 = [0, 0, 0];
      const numStep1 = 2 * Math.max(Math.abs(v1[0]), Math.abs(v1[1]), Math.abs(v1[2]));
      scale(step1, v1, 1 / numStep1);
      const step2 = [0, 0, 0];
      const numStep2 = 2 * Math.max(Math.abs(v2[0]), Math.abs(v2[1]), Math.abs(v2[2]));
      scale(step2, v2, 1 / numStep2);
      const jStride = globals.dimensions[0];
      const kStride = globals.dimensions[0] * globals.dimensions[1];
      for (let u = 0; u <= numStep1 + 1; u++) {
        const maxV = numStep2 - u * (numStep2 / numStep1);
        for (let v = 0; v <= maxV + 1; v++) {
          const point = [...point0];
          scaleAndAdd(point, point, step1, u);
          scaleAndAdd(point, point, step2, v);
          point[0] = Math.round(point[0]);
          point[1] = Math.round(point[1]);
          point[2] = Math.round(point[2]);
          if (point[0] >= 0 && point[0] < globals.dimensions[0] && point[1] >= 0 && point[1] < globals.dimensions[1] && point[2] >= 0 && point[2] < globals.dimensions[2]) {
            globals.buffer[point[0] + jStride * point[1] + kStride * point[2]] = 1;
          }
        }
      }
    }
  }

  // --------------------------------------------------------------------------

  registerWebworker().operation('start', _ref5 => {
    let {
      bufferType,
      dimensions,
      slicingMode
    } = _ref5;
    if (!globals.buffer) {
      const bufferSize = dimensions[0] * dimensions[1] * dimensions[2];
      /* eslint-disable-next-line */
      globals.buffer = new self[bufferType](bufferSize);
      globals.dimensions = dimensions;
      globals.prevPoint = null;
      globals.slicingMode = slicingMode;
    }
  }).operation('paint', handlePaint).operation('paintRectangle', handlePaintRectangle).operation('paintEllipse', handlePaintEllipse).operation('paintTriangles', handlePaintTriangles).operation('end', () => {
    const response = new registerWebworker.TransferableResponse(globals.buffer.buffer, [globals.buffer.buffer]);
    globals.buffer = null;
    return response;
  });

})();
}, null);
/* eslint-enable */

export { WorkerFactory as W };
