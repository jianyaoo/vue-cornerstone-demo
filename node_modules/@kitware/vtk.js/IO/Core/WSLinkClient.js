import { m as macro } from '../../macros2.js';
import vtkImageStream from './ImageStream.js';

// ----------------------------------------------------------------------------
// Dependency injection
// ----------------------------------------------------------------------------

let SMART_CONNECT_CLASS = null;

// ----------------------------------------------------------------------------

function setSmartConnectClass(klass) {
  SMART_CONNECT_CLASS = klass;
}

// ----------------------------------------------------------------------------
// Busy feedback handling
// ----------------------------------------------------------------------------

function busy(fn, update) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return new Promise((resolve, reject) => {
      update(1);
      fn(...args).then(response => {
        update(-1);
        resolve(response);
      }, error => {
        update(-1);
        reject(error);
      });
    });
  };
}

// ----------------------------------------------------------------------------

function busyWrap(methodMap, update) {
  let skipList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const busyContainer = {};
  Object.keys(methodMap).forEach(methodName => {
    if (skipList.indexOf(methodName) === -1) {
      busyContainer[methodName] = busy(methodMap[methodName], update);
    } else {
      busyContainer[methodName] = methodMap[methodName];
    }
  });
  return busyContainer;
}

// ----------------------------------------------------------------------------
// vtkWSLinkClient
// ----------------------------------------------------------------------------

function vtkWSLinkClient(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkWSLinkClient');

  // --------------------------------------------------------------------------
  // Internal methods
  // --------------------------------------------------------------------------

  function notifyBusy() {
    publicAPI.invokeBusyChange(model.busyCount);
  }

  // --------------------------------------------------------------------------

  function updateBusy() {
    let delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    model.busyCount += delta;

    // Clear any pending timeout
    if (model.timeoutId) {
      clearTimeout(model.timeoutId);
      model.timeoutId = 0;
    }

    // Delay notification when idle
    if (model.busyCount) {
      notifyBusy();
    } else {
      model.timeoutId = setTimeout(notifyBusy, model.notificationTimeout);
    }
  }

  // --------------------------------------------------------------------------
  // Public methods
  // --------------------------------------------------------------------------

  publicAPI.beginBusy = () => updateBusy(+1);
  publicAPI.endBusy = () => updateBusy(-1);
  publicAPI.isBusy = () => !!model.busyCount;
  publicAPI.isConnected = () => !!model.connection;

  // --------------------------------------------------------------------------

  publicAPI.connect = function () {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let configDecorator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (!SMART_CONNECT_CLASS) {
      return Promise.reject(new Error('Need to provide SmartConnect'));
    }
    if (model.connection) {
      return Promise.reject(new Error('Need to disconnect first'));
    }
    model.config = config;
    model.configDecorator = configDecorator || model.configDecorator;
    return new Promise((resolve, reject) => {
      model.smartConnect = SMART_CONNECT_CLASS.newInstance({
        config,
        configDecorator: model.configDecorator
      });

      // ready
      model.smartConnect.onConnectionReady(connection => {
        model.connection = connection;
        model.remote = {};
        model.config = model.smartConnect.getConfig();
        const session = connection.getSession();

        // Link remote API
        model.protocols = model.protocols || {};
        Object.keys(model.protocols).forEach(name => {
          model.remote[name] = busyWrap(model.protocols[name](session), updateBusy, model.notBusyList);
        });

        // Handle image stream if needed
        if (model.createImageStream) {
          model.imageStream = vtkImageStream.newInstance();
          model.imageStream.connect(session);
        }

        // Forward ready info as well
        publicAPI.invokeConnectionReady(publicAPI);
        resolve(publicAPI);
      });

      // error
      model.smartConnect.onConnectionError(error => {
        publicAPI.invokeConnectionError(error);
        reject(error);
      });

      // close
      model.smartConnect.onConnectionClose(close => {
        publicAPI.invokeConnectionClose(close);
        reject(close);
      });

      // Start connection
      model.smartConnect.connect();
    });
  };

  // --------------------------------------------------------------------------

  publicAPI.disconnect = function () {
    let timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;
    if (model.connection) {
      model.connection.destroy(timeout);
      model.connection = null;
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.registerProtocol = (name, protocol) => {
    model.remote[name] = busyWrap(protocol(model.connection.getSession()), updateBusy, model.notBusyList);
  };

  // --------------------------------------------------------------------------

  publicAPI.unregisterProtocol = name => {
    delete model.remote[name];
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // protocols: null,
  // connection: null,
  // config: null,
  // imageStream
  notBusyList: [],
  busyCount: 0,
  timeoutId: 0,
  notificationTimeout: 50,
  createImageStream: true
  // configDecorator: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['protocols', 'notBusyList', 'createImageStream', 'configDecorator']);
  macro.get(publicAPI, model, ['connection', 'config', 'remote', 'imageStream']);
  macro.event(publicAPI, model, 'BusyChange');
  macro.event(publicAPI, model, 'ConnectionReady');
  macro.event(publicAPI, model, 'ConnectionError');
  macro.event(publicAPI, model, 'ConnectionClose');

  // Object specific methods
  vtkWSLinkClient(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkWSLinkClient');

// ----------------------------------------------------------------------------

var vtkWSLinkClient$1 = {
  newInstance,
  extend,
  setSmartConnectClass
};

export { vtkWSLinkClient$1 as default, extend, newInstance };
