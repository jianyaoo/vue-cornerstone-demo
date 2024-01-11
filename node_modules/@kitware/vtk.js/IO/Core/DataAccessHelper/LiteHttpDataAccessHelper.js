import { m as macro } from '../../../macros2.js';
import Endian from '../../../Common/Core/Endian.js';
import { DataTypeByteSize } from '../../../Common/Core/DataArray/Constants.js';
import { has, registerType } from '../DataAccessHelper.js';

const {
  vtkErrorMacro,
  vtkDebugMacro
} = macro;
const REJECT_COMPRESSION = () => {
  vtkErrorMacro('LiteHttpDataAccessHelper does not support compression. Need to register HttpDataAccessHelper instead.');
  return Promise.reject(new Error('LiteHttpDataAccessHelper does not support compression. Need to register HttpDataAccessHelper instead.'));
};

/* eslint-disable prefer-promise-reject-errors */
let requestCount = 0;
function openAsyncXHR(method, url) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  if (options.headers) {
    Object.entries(options.headers).forEach(_ref => {
      let [key, value] = _ref;
      return xhr.setRequestHeader(key, value);
    });
  }
  if (options.progressCallback) {
    xhr.addEventListener('progress', options.progressCallback);
  }
  return xhr;
}
function fetchBinary(url) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise((resolve, reject) => {
    const xhr = openAsyncXHR('GET', url, options);
    xhr.onreadystatechange = e => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.response);
        } else {
          reject({
            xhr,
            e
          });
        }
      }
    };

    // Make request
    xhr.responseType = 'arraybuffer';
    xhr.send();
  });
}
function fetchArray(instance, baseURL, array) {
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (options && options.compression) {
    return REJECT_COMPRESSION();
  }
  if (array.ref && !array.ref.pending) {
    return new Promise((resolve, reject) => {
      const url = [baseURL, array.ref.basepath, array.ref.id].join('/');
      const xhr = openAsyncXHR('GET', url, options);
      xhr.onreadystatechange = e => {
        if (xhr.readyState === 1) {
          array.ref.pending = true;
          if (++requestCount === 1 && instance?.invokeBusy) {
            instance.invokeBusy(true);
          }
        }
        if (xhr.readyState === 4) {
          array.ref.pending = false;
          if (xhr.status === 200 || xhr.status === 0) {
            array.buffer = xhr.response;
            if (array.ref.encode === 'JSON') {
              array.values = JSON.parse(array.buffer);
            } else {
              if (Endian.ENDIANNESS !== array.ref.encode && Endian.ENDIANNESS) {
                // Need to swap bytes
                vtkDebugMacro(`Swap bytes of ${array.name}`);
                Endian.swapBytes(array.buffer, DataTypeByteSize[array.dataType]);
              }
              array.values = macro.newTypedArray(array.dataType, array.buffer);
            }
            if (array.values.length !== array.size) {
              vtkErrorMacro(`Error in FetchArray: ${array.name}, does not have the proper array size. Got ${array.values.length}, instead of ${array.size}`);
            }

            // Done with the ref and work
            delete array.ref;
            if (--requestCount === 0 && instance?.invokeBusy) {
              instance.invokeBusy(false);
            }
            if (instance?.modified) {
              instance.modified();
            }
            resolve(array);
          } else {
            reject({
              xhr,
              e
            });
          }
        }
      };

      // Make request
      xhr.responseType = array.dataType !== 'string' ? 'arraybuffer' : 'text';
      xhr.send();
    });
  }
  return Promise.resolve(array);
}

// ----------------------------------------------------------------------------

function fetchJSON(instance, url) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (options && options.compression) {
    return REJECT_COMPRESSION();
  }
  return new Promise((resolve, reject) => {
    const xhr = openAsyncXHR('GET', url, options);
    xhr.onreadystatechange = e => {
      if (xhr.readyState === 1) {
        if (++requestCount === 1 && instance?.invokeBusy) {
          instance.invokeBusy(true);
        }
      }
      if (xhr.readyState === 4) {
        if (--requestCount === 0 && instance?.invokeBusy) {
          instance.invokeBusy(false);
        }
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject({
            xhr,
            e
          });
        }
      }
    };

    // Make request
    xhr.responseType = 'text';
    xhr.send();
  });
}

// ----------------------------------------------------------------------------

function fetchText(instance, url) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (options && options.compression) {
    return REJECT_COMPRESSION();
  }
  return new Promise((resolve, reject) => {
    const xhr = openAsyncXHR('GET', url, options);
    xhr.onreadystatechange = e => {
      if (xhr.readyState === 1) {
        if (++requestCount === 1 && instance?.invokeBusy) {
          instance.invokeBusy(true);
        }
      }
      if (xhr.readyState === 4) {
        if (--requestCount === 0 && instance?.invokeBusy) {
          instance.invokeBusy(false);
        }
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.responseText);
        } else {
          reject({
            xhr,
            e
          });
        }
      }
    };

    // Make request
    xhr.responseType = 'text';
    xhr.send();
  });
}

// ----------------------------------------------------------------------------

function fetchImage(instance, url) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (options.crossOrigin) {
      img.crossOrigin = options.crossOrigin;
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
/* eslint-enable prefer-promise-reject-errors */

// ----------------------------------------------------------------------------

const LiteHttpDataAccessHelper = {
  fetchArray,
  fetchJSON,
  fetchText,
  fetchBinary,
  // Only for HTTP
  fetchImage
};

// The lite version should never override a full feature one...
if (!has('http')) {
  registerType('http', options => LiteHttpDataAccessHelper);
}

export { LiteHttpDataAccessHelper as default };
