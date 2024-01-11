/* global XMLHttpRequest */
import CompositeClosureHelper from '../CompositeClosureHelper';

const connections = [];

function ProcessLauncher(publicAPI, model) {
  publicAPI.start = (config) => {
    var xhr = new XMLHttpRequest(),
      url = model.endPoint;

    xhr.open('POST', url, true);

    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) =>
        xhr.setRequestHeader(key, value)
      );
      delete config.headers;
    }

    xhr.responseType = 'json';
    const supportsJson = 'response' in xhr && xhr.responseType === 'json';

    xhr.onload = (e) => {
      const response = supportsJson ? xhr.response : JSON.parse(xhr.response);
      if (xhr.status === 200 && response && !response.error) {
        // Add connection to our global list
        connections.push(response);
        publicAPI.fireProcessReady(response);
        return;
      }
      publicAPI.fireError(xhr);
    };

    xhr.onerror = (e) => {
      publicAPI.fireError(xhr);
    };

    xhr.send(JSON.stringify(config));
  };

  publicAPI.fetchConnection = (sessionId) => {
    var xhr = new XMLHttpRequest(),
      url = [model.endPoint, sessionId].join('/');

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    const supportsJson = 'response' in xhr && xhr.responseType === 'json';

    xhr.onload = (e) => {
      if (this.status === 200) {
        publicAPI.fireFetch(
          supportsJson ? xhr.response : JSON.parse(xhr.response)
        );
        return;
      }
      publicAPI.fireError(xhr);
    };

    xhr.onerror = (e) => {
      publicAPI.fireError(xhr);
    };

    xhr.send();
  };

  publicAPI.stop = (connection) => {
    var xhr = new XMLHttpRequest(),
      url = [model.endPoint, connection.id].join('/');

    xhr.open('DELETE', url, true);
    xhr.responseType = 'json';
    const supportsJson = 'response' in xhr && xhr.responseType === 'json';

    xhr.onload = (e) => {
      if (this.status === 200) {
        const response = supportsJson ? xhr.response : JSON.parse(xhr.response);
        // Remove connection from the list
        // FIXME / TODO
        publicAPI.fireProcessStopped(response);
        return;
      }
      publicAPI.fireError(xhr);
    };
    xhr.onerror = (e) => {
      publicAPI.fireError(xhr);
    };
    xhr.send();
  };

  publicAPI.listConnections = () => {
    return connections;
  };
}

const DEFAULT_VALUES = {
  endPoint: null,
};

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  CompositeClosureHelper.destroy(publicAPI, model);
  CompositeClosureHelper.event(publicAPI, model, 'ProcessReady');
  CompositeClosureHelper.event(publicAPI, model, 'ProcessStopped');
  CompositeClosureHelper.event(publicAPI, model, 'Fetch');
  CompositeClosureHelper.event(publicAPI, model, 'Error');
  CompositeClosureHelper.isA(publicAPI, model, 'ProcessLauncher');

  ProcessLauncher(publicAPI, model);
}

// ----------------------------------------------------------------------------
export const newInstance = CompositeClosureHelper.newInstance(extend);

export default { newInstance, extend };
