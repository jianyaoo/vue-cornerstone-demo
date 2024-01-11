// Helper borrowed from paraviewweb/src/Common/Core
import CompositeClosureHelper from '../CompositeClosureHelper';
import JSON5 from 'json5';

function defer() {
  const deferred = {};

  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}

function Session(publicAPI, model) {
  const CLIENT_ERROR = -32099;
  let msgCount = 0;
  const inFlightRpc = {};
  const attachments = [];
  const attachmentsToSend = {};
  let attachmentId = 1;
  const regexAttach = /^wslink_bin[\d]+$/;
  // matches 'rpc:client3:21'
  // client may be dot-separated and include '_'
  // number is message count - unique.
  // matches 'publish:dot.separated.topic:42'
  const regexRPC = /^(rpc|publish|system):(\w+(?:\.\w+)*):(?:\d+)$/;
  const subscriptions = {};
  let clientID = null;

  // --------------------------------------------------------------------------
  // Private helpers
  // --------------------------------------------------------------------------

  function sendBinary(key) {
    if (key in attachmentsToSend) {
      // binary header
      model.ws.send(
        JSON.stringify({
          wslink: '1.0',
          method: 'wslink.binary.attachment',
          args: [key],
        })
      );

      // send binary
      model.ws.send(attachmentsToSend[key], { binary: true });
      delete attachmentsToSend[key];
    }
  }

  // --------------------------------------------------------------------------

  function findBinary(o) {
    if (o) {
      if (Array.isArray(o)) {
        o.forEach((v) => findBinary(v));
      } else if (o.constructor === Object) {
        Object.keys(o).forEach((k) => findBinary(o[k]));
      } else if (regexAttach.test(o)) {
        sendBinary(o);
      }
    }
  }

  // --------------------------------------------------------------------------
  // split out to support a message with a bare binary attachment.
  // --------------------------------------------------------------------------

  function getAttachment(binaryKey) {
    // console.log('Adding binary attachment', binaryKey);
    const index = attachments.findIndex((att) => att.key === binaryKey);
    if (index !== -1) {
      const result = attachments[index].data;
      // TODO if attachment is sent mulitple times, we shouldn't remove it yet.
      attachments.splice(index, 1);
      return result;
    }
    console.error('Binary attachment key found without matching attachment');
    return null;
  }

  // --------------------------------------------------------------------------
  // To do a full traversal of nested objects/lists, we need recursion.
  // --------------------------------------------------------------------------

  function addAttachment(obj_list) {
    for (let key in obj_list) {
      if (
        typeof obj_list[key] === 'string' &&
        regexAttach.test(obj_list[key])
      ) {
        const binaryKey = obj_list[key];
        const replacement = getAttachment(binaryKey);
        if (replacement !== null) obj_list[key] = replacement;
      } else if (typeof obj_list[key] === 'object') {
        // arrays are also 'object' with this test.
        addAttachment(obj_list[key]);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  publicAPI.onconnect = (event) => {
    // send hello message
    const deferred = defer();
    const id = 'system:c0:0';
    inFlightRpc[id] = deferred;
    model.ws.send(
      JSON.stringify({
        wslink: '1.0',
        id,
        method: 'wslink.hello',
        args: [{ secret: model.secret }],
        kwargs: {},
      })
    );
    return deferred.promise;
  };

  // --------------------------------------------------------------------------

  publicAPI.call = (method, args = [], kwargs = {}) => {
    // create a promise that we will use to notify the caller of the result.
    const deferred = defer();
    // readyState OPEN === 1
    if (model.ws && clientID && model.ws.readyState === 1) {
      const id = `rpc:${clientID}:${msgCount++}`;
      inFlightRpc[id] = deferred;
      const msg = JSON.stringify({ wslink: '1.0', id, method, args, kwargs });

      if (Object.keys(attachmentsToSend).length) {
        findBinary(args);
        findBinary(kwargs);
      }

      model.ws.send(
        JSON.stringify({ wslink: '1.0', id, method, args, kwargs })
      );
    } else {
      deferred.reject({
        code: CLIENT_ERROR,
        message: `RPC call ${method} unsuccessful: connection not open`,
      });
    }
    return deferred.promise;
  };

  // --------------------------------------------------------------------------

  publicAPI.subscribe = (topic, callback) => {
    const deferred = defer();
    if (model.ws && clientID) {
      // we needs to track subscriptions, to trigger callback when publish is received.
      if (!subscriptions[topic]) subscriptions[topic] = [];
      subscriptions[topic].push(callback);
      // we can notify the server, but we don't need to, if the server always sends messages unconditionally.
      // model.ws.send(JSON.stringify({ wslink: '1.0', id: `subscribe:${msgCount++}`, method, args: [] }));
      deferred.resolve({ topic, callback });
    } else {
      deferred.reject({
        code: CLIENT_ERROR,
        message: `Subscribe call ${topic} unsuccessful: connection not open`,
      });
    }
    return {
      topic,
      callback,
      promise: deferred.promise,
      unsubscribe: () => publicAPI.unsubscribe({ topic, callback }),
    };
  };

  // --------------------------------------------------------------------------

  publicAPI.unsubscribe = (info) => {
    const deferred = defer();
    const { topic, callback } = info;
    if (!subscriptions[topic]) {
      deferred.reject({
        code: CLIENT_ERROR,
        message: `Unsubscribe call ${topic} unsuccessful: not subscribed`,
      });
      return deferred.promise;
    }
    const index = subscriptions[topic].indexOf(callback);
    if (index !== -1) {
      subscriptions[topic].splice(index, 1);
      deferred.resolve();
    } else {
      deferred.reject({
        code: CLIENT_ERROR,
        message: `Unsubscribe call ${topic} unsuccessful: callback not found`,
      });
    }
    return deferred.promise;
  };

  // --------------------------------------------------------------------------

  publicAPI.close = () => {
    const deferred = defer();
    // some transports might be able to close the session without closing the connection. Not true for websocket...
    model.ws.close();
    deferred.resolve();
    return deferred.promise;
  };

  // --------------------------------------------------------------------------

  publicAPI.onmessage = (event) => {
    if (event.data instanceof ArrayBuffer || event.data instanceof Blob) {
      // we've gotten a header with the keys for this binary data.
      // we will soon receive a json message with embedded ids of the binary objects.
      // Save with it's key, in order.
      // console.log('Saving binary attachment');
      let foundIt = false;
      for (let i = 0; i < attachments.length; i++) {
        if (attachments[i].data === null) {
          attachments[i].data = event.data;
          foundIt = true;
          break;
        }
      }
      if (!foundIt) {
        console.error('Missing header for received binary message');
      }
    } else {
      let payload;
      try {
        payload = JSON5.parse(event.data);
      } catch (e) {
        console.error('Malformed message: ', event.data);
        // debugger;
      }
      if (!payload) return;
      if (!payload.id) {
        // Notification-only message from the server - should be binary attachment header
        // console.log('Notify', payload);
        if (payload.method === 'wslink.binary.attachment') {
          payload.args.forEach((key) => {
            attachments.push({ key, data: null });
          });
        }
        return;
      }
      if (payload.error) {
        // kill any attachments
        attachments.length = 0;
        const deferred = inFlightRpc[payload.id];
        if (deferred) {
          deferred.reject(payload.error);
        } else {
          console.error('Server error:', payload.error);
        }
      } else {
        if (payload.result && attachments.length > 0) {
          if (
            typeof payload.result === 'string' &&
            regexAttach.test(payload.result)
          ) {
            const replacement = getAttachment(payload.result);
            if (replacement !== null) payload.result = replacement;
          } else {
            addAttachment(payload.result);
          }
        }
        const match = regexRPC.exec(payload.id);
        if (match) {
          const type = match[1];
          if (type === 'rpc') {
            const deferred = inFlightRpc[payload.id];
            if (!deferred) {
              console.log(
                'session message id without matching call, dropped',
                payload
              );
              return;
            }
            deferred.resolve(payload.result);
          } else if (type == 'publish') {
            console.assert(
              inFlightRpc[payload.id] === undefined,
              'publish message received matching in-flight rpc call'
            );
            // regex extracts the topic for us.
            const topic = match[2];
            if (!subscriptions[topic]) {
              return;
            }
            // for each callback, provide the message data. Wrap in an array, for back-compatibility with WAMP
            subscriptions[topic].forEach((callback) =>
              callback([payload.result])
            );
          } else if (type == 'system') {
            // console.log('DBG system:', payload.id, payload.result);
            const deferred = inFlightRpc[payload.id];
            if (payload.id === 'system:c0:0') {
              clientID = payload.result.clientID;
              if (deferred) deferred.resolve(clientID);
            } else {
              console.error('Unknown system message', payload.id);
              if (deferred)
                deferred.reject({
                  code: CLIENT_ERROR,
                  message: `Unknown system message ${payload.id}`,
                });
            }
          } else {
            console.error('Unknown rpc id format', payload.id);
          }
        }
      }
      delete inFlightRpc[payload.id];
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.addAttachment = (payload) => {
    const binaryId = `wslink_bin${attachmentId}`;
    attachmentsToSend[binaryId] = payload;
    attachmentId++;
    return binaryId;
  };
}

const DEFAULT_VALUES = {
  secret: 'wslink-secret',
  ws: null,
};

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  CompositeClosureHelper.destroy(publicAPI, model);
  CompositeClosureHelper.isA(publicAPI, model, 'Session');

  Session(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = CompositeClosureHelper.newInstance(extend);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
