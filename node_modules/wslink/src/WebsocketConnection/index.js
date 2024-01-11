// Helper borrowed from paraviewweb/src/Common/Core
import CompositeClosureHelper from '../CompositeClosureHelper';
import Session from './session';

const DEFAULT_SECRET = 'wslink-secret';

function getTransportObject(url) {
  var idx = url.indexOf(':'),
    protocol = url.substring(0, idx);
  if (protocol === 'ws' || protocol === 'wss') {
    return {
      type: 'websocket',
      url,
    };
  }

  throw new Error(
    `Unknown protocol (${protocol}) for url (${url}).  Unable to create transport object.`
  );
}

function WebsocketConnection(publicAPI, model) {
  // TODO Should we try to reconnect on error?

  publicAPI.connect = () => {
    // without a URL we can't do anything.
    if (!model.urls) return null;
    // concat allows a single url or a list.
    var uriList = [].concat(model.urls),
      transports = [];

    for (let i = 0; i < uriList.length; i += 1) {
      const url = uriList[i];
      try {
        const transport = getTransportObject(url);
        transports.push(transport);
      } catch (transportCreateError) {
        console.error(transportCreateError);
        publicAPI.fireConnectionError(publicAPI, transportCreateError);
        return null;
      }
    }

    if (model.connection) {
      if (model.connection.url !== transports[0].url) {
        model.connection.close();
      } else if (
        model.connection.readyState === 0 ||
        model.connection.readyState === 1
      ) {
        // already connected.
        return model.session;
      }
    }
    try {
      if (model.wsProxy) {
        model.connection = WSLINK.createWebSocket(transports[0].url);
      } else {
        model.connection = new WebSocket(transports[0].url);
      }
    } catch (err) {
      // If the server isn't running, we still don't enter here on Chrome -
      // console shows a net::ERR_CONNECTION_REFUSED error inside WebSocket
      console.error(err);
      publicAPI.fireConnectionError(publicAPI, err);
      return null;
    }

    model.connection.binaryType = 'blob';
    if (!model.secret) model.secret = DEFAULT_SECRET;
    model.session = Session.newInstance({
      ws: model.connection,
      secret: model.secret,
    });

    model.connection.onopen = (event) => {
      if (model.session) {
        // sends handshake message - wait for reply before issuing ready()
        model.session.onconnect(event).then(
          () => {
            publicAPI.fireConnectionReady(publicAPI);
          },
          (err) => {
            console.error('Connection error', err);
            publicAPI.fireConnectionError(publicAPI, err);
          }
        );
      }
    };

    model.connection.onclose = (event) => {
      publicAPI.fireConnectionClose(publicAPI, event);
      model.connection = null;
      // return !model.retry; // true => Stop retry
    };
    model.connection.onerror = (event) => {
      publicAPI.fireConnectionError(publicAPI, event);
    };
    // handle messages in the session.
    model.connection.onmessage = (event) => {
      model.session.onmessage(event);
    };
    return model.session;
  };

  publicAPI.getSession = () => model.session;

  publicAPI.getUrl = () =>
    model.connection ? model.connection.url : undefined;

  function cleanUp(timeout = 10) {
    if (
      model.connection &&
      model.connection.readyState === 1 &&
      model.session &&
      timeout > 0
    ) {
      model.session.call('application.exit.later', [timeout]);
    }
    if (model.connection) {
      model.connection.close();
    }
    model.connection = null;
  }

  publicAPI.destroy = CompositeClosureHelper.chain(cleanUp, publicAPI.destroy);
}

const DEFAULT_VALUES = {
  secret: DEFAULT_SECRET,
  connection: null,
  session: null,
  retry: false,
  wsProxy: false, // Use WSLINK.WebSocket if true else native WebSocket
};

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  CompositeClosureHelper.destroy(publicAPI, model);
  CompositeClosureHelper.event(publicAPI, model, 'ConnectionReady');
  CompositeClosureHelper.event(publicAPI, model, 'ConnectionClose');
  CompositeClosureHelper.event(publicAPI, model, 'ConnectionError');
  CompositeClosureHelper.isA(publicAPI, model, 'WebsocketConnection');

  WebsocketConnection(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = CompositeClosureHelper.newInstance(extend);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
