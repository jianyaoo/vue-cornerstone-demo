/* global window */
import CompositeClosureHelper from '../CompositeClosureHelper';

import ProcessLauncher from '../ProcessLauncher';
import WebsocketConnection from '../WebsocketConnection';

function DEFAULT_CONFIG_DECORATOR(config) {
  if (config.sessionURL) {
    config.sessionURL = config.sessionURL.replaceAll(
      'USE_HOSTNAME',
      window.location.hostname
    );
    config.sessionURL = config.sessionURL.replaceAll(
      'USE_HOST',
      window.location.host
    );
  }
  return config;
}

function extractPathName(addOn, pathName = window.location.pathname) {
  if (pathName.endsWith('.html') || pathName.endsWith('.htm')) {
    const tokens = pathName.split('/');
    tokens.pop();
    pathName = tokens.join('/');
  }
  while (pathName.length > 0 && pathName[pathName.length - 1] === '/') {
    pathName = pathName.substring(0, pathName.length - 1);
  }
  if (pathName.length === 0) {
    return addOn;
  }
  return `${pathName}${addOn}`;
}

export const DEFAULT_SESSION_MANAGER_URL = `${window.location.protocol}//${
  window.location.hostname
}:${window.location.port}${extractPathName('/paraview/')}`;

export const DEFAULT_SESSION_URL = `${
  window.location.protocol === 'https:' ? 'wss:' : 'ws:'
}//${window.location.hostname}:${window.location.port}${extractPathName(
  '/ws'
)}`;

function wsConnect(publicAPI, model) {
  const wsConnection = WebsocketConnection.newInstance({
    urls: model.config.sessionURL,
    secret: model.config.secret,
    retry: model.config.retry,
    wsProxy: model.config.iframe || model.config.wsProxy,
  });
  model.subscriptions.push(
    wsConnection.onConnectionReady(publicAPI.readyForwarder)
  );
  model.subscriptions.push(
    wsConnection.onConnectionError(publicAPI.errorForwarder)
  );
  model.subscriptions.push(
    wsConnection.onConnectionClose(publicAPI.closeForwarder)
  );

  // Add to the garbage collector
  model.gc.push(wsConnection);

  return wsConnection.connect();
}

function smartConnect(publicAPI, model) {
  let session = null;
  model.gc = [];

  // Event forwarders
  publicAPI.readyForwarder = (data) => {
    session = data.getSession();
    publicAPI.fireConnectionReady(data);
  };
  publicAPI.errorForwarder = (data, err) => {
    publicAPI.fireConnectionError(data, err);
  };
  publicAPI.closeForwarder = (data, err) => {
    publicAPI.fireConnectionClose(data, err);
  };

  publicAPI.connect = () => {
    if (model.configDecorator) {
      model.config = model.configDecorator(model.config);
    }
    model.config = DEFAULT_CONFIG_DECORATOR(model.config);

    if (model.config.sessionURL) {
      // We have a direct connection URL
      session = wsConnect(publicAPI, model);
    } else if (model.config.wsProxy) {
      // Provide fake url if missing since we rely on a proxy
      model.config.sessionURL = model.config.sessionURL || "wss://proxy/";
      session = wsConnect(publicAPI, model);
    } else {
      // We need to use the Launcher
      const launcher = ProcessLauncher.newInstance({
        endPoint: model.config.sessionManagerURL || DEFAULT_SESSION_MANAGER_URL,
      });

      model.subscriptions.push(
        launcher.onProcessReady((data) => {
          if (model.configDecorator) {
            model.config = model.configDecorator(
              Object.assign({}, model.config, data)
            );
          } else {
            model.config = Object.assign({}, model.config, data);
          }
          model.config = DEFAULT_CONFIG_DECORATOR(model.config);

          session = wsConnect(publicAPI, model);
        })
      );
      model.subscriptions.push(
        launcher.onError((data) => {
          if (data && data.response && data.response.error) {
            publicAPI.errorForwarder(data, data.response.error);
          } else {
            // Try to use standard connection URL
            model.config.sessionURL = DEFAULT_SESSION_URL;
            model.config = DEFAULT_CONFIG_DECORATOR(model.config);
            session = wsConnect(publicAPI, model);
          }
        })
      );

      launcher.start(model.config);

      // Add to the garbage collector
      model.gc.push(launcher);
    }
  };

  publicAPI.getSession = () => {
    return session;
  };

  function cleanUp(timeout) {
    if (session) {
      if (timeout > 0) {
        session.call('application.exit.later', [timeout]);
      }
      session.close();
    }
    session = null;

    while (model.gc.length) {
      model.gc.pop().destroy();
    }
  }

  publicAPI.destroy = CompositeClosureHelper.chain(cleanUp, publicAPI.destroy);
}

const DEFAULT_VALUES = {
  config: {},
  // configDecorator: null,
};

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  CompositeClosureHelper.destroy(publicAPI, model);
  CompositeClosureHelper.event(publicAPI, model, 'ConnectionReady');
  CompositeClosureHelper.event(publicAPI, model, 'ConnectionClose');
  CompositeClosureHelper.event(publicAPI, model, 'ConnectionError');
  CompositeClosureHelper.isA(publicAPI, model, 'SmartConnect');
  CompositeClosureHelper.get(publicAPI, model, ['config', 'configDecorator']);
  CompositeClosureHelper.set(publicAPI, model, ['configDecorator']);

  smartConnect(publicAPI, model);
}

// ----------------------------------------------------------------------------
export const newInstance = CompositeClosureHelper.newInstance(extend);

export default { newInstance, extend };
