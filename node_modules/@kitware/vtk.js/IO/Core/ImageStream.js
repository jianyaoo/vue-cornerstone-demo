import { m as macro } from '../../macros2.js';
import createMethods from './ImageStream/DefaultProtocol.js';
import ViewStream from './ImageStream/ViewStream.js';

function vtkImageStream(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageStream');

  // --------------------------------------------------------------------------
  // Internal private method
  // --------------------------------------------------------------------------

  function onImage(data) {
    const message = data[0];
    if (!message || !message.image) {
      return;
    }
    for (let i = 0; i < model.viewStreams.length; i++) {
      model.viewStreams[i].processMessage(message);
    }
  }

  // --------------------------------------------------------------------------
  // PublicAPI
  // --------------------------------------------------------------------------

  publicAPI.setServerAnimationFPS = function () {
    let maxFPS = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
    let changeDetected = false;
    if (model.serverAnimationFPS !== maxFPS) {
      model.serverAnimationFPS = maxFPS;
      changeDetected = true;
    }
    if (!model.protocol) {
      return Promise.resolve(true);
    }
    if (changeDetected) {
      publicAPI.modified();
    }
    return model.protocol.setServerAnimationFPS(maxFPS);
  };

  // --------------------------------------------------------------------------

  publicAPI.connect = function (session) {
    let protocol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createMethods;
    if (model.connected || !session || !protocol) {
      return;
    }
    model.protocol = protocol(session);
    model.protocol.subscribeToImageStream(onImage).promise // new API in wslink 1.0.5+
    .then(subscription => {
      model.renderTopicSubscription = subscription;
      model.connected = true;
    }).catch(e => {
      model.connected = false;
      console.error(e);
    });
  };

  // --------------------------------------------------------------------------

  publicAPI.disconnect = () => {
    if (model.protocol && model.connected && model.renderTopicSubscription) {
      model.protocol.unsubscribeToImageStream(model.renderTopicSubscription);
      model.renderTopicSubscription = null;
    }
    model.connected = false;
  };

  // --------------------------------------------------------------------------

  publicAPI.registerViewStream = view => {
    model.viewStreams.push(view);
  };

  // --------------------------------------------------------------------------

  publicAPI.unregisterViewStream = view => {
    model.viewStreams = model.viewStreams.filter(v => v !== view);
  };

  // --------------------------------------------------------------------------

  publicAPI.createViewStream = function () {
    let viewId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '-1';
    let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [400, 400];
    const {
      setServerAnimationFPS,
      getServerAnimationFPS,
      unregisterViewStream
    } = publicAPI;
    const viewStream = ViewStream.newInstance({
      protocol: model.protocol,
      unregisterViewStream,
      sharedAPI: {
        setServerAnimationFPS,
        getServerAnimationFPS
      }
    });
    viewStream.setViewId(viewId);
    viewStream.setSize(size[0], size[1]);
    publicAPI.registerViewStream(viewStream);
    return viewStream;
  };

  // --------------------------------------------------------------------------

  publicAPI.delete = macro.chain(() => {
    while (model.viewStreams.length) {
      model.viewStreams.pop().delete();
    }
    publicAPI.disconnect();
  }, publicAPI.delete);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // protocol: null,
  viewStreams: [],
  serverAnimationFPS: -1
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  let initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.get(publicAPI, model, ['serverAnimationFPS', 'protocol']);

  // Object specific methods
  vtkImageStream(publicAPI, model);
}

// ----------------------------------------------------------------------------

const newInstance = macro.newInstance(extend, 'vtkImageStream');

// ----------------------------------------------------------------------------

var vtkImageStream$1 = {
  newInstance,
  extend
};

export { vtkImageStream$1 as default, extend, newInstance };
