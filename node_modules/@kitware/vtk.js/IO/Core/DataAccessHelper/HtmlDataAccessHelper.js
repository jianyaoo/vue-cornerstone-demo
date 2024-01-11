import { strFromU8, decompressSync } from 'fflate';
import { m as macro } from '../../../macros2.js';
import Base64 from '../../../Common/Core/Base64.js';
import Endian from '../../../Common/Core/Endian.js';
import { DataTypeByteSize } from '../../../Common/Core/DataArray/Constants.js';
import { registerType } from '../DataAccessHelper.js';

const {
  vtkErrorMacro,
  vtkDebugMacro
} = macro;
let requestCount = 0;
function getContent(url) {
  const el = document.querySelector(`.webResource[data-url="${url}"]`);
  return el ? el.innerHTML : null;
}
function getElement(url) {
  return document.querySelector(`.webResource[data-url="${url}"]`);
}
function removeLeadingSlash(str) {
  return str[0] === '/' ? str.substr(1) : str;
}
function fetchText(instance, url) {
  return new Promise((resolve, reject) => {
    const txt = getContent(url);
    if (txt === null) {
      reject(new Error(`No such text ${url}`));
    } else {
      resolve(txt);
    }
  });
}
function fetchJSON(instance, url) {
  return new Promise((resolve, reject) => {
    const txt = getContent(removeLeadingSlash(url));
    if (txt === null) {
      reject(new Error(`No such JSON ${url}`));
    } else {
      resolve(JSON.parse(txt));
    }
  });
}
function fetchArray(instance, baseURL, array) {
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return new Promise((resolve, reject) => {
    const url = removeLeadingSlash([baseURL, array.ref.basepath, options.compression ? `${array.ref.id}.gz` : array.ref.id].join('/'));
    const txt = getContent(url);
    if (txt === null) {
      reject(new Error(`No such array ${url}`));
    } else {
      if (array.dataType === 'string') {
        let bText = atob(txt);
        if (options.compression) {
          bText = strFromU8(decompressSync(bText));
        }
        array.values = JSON.parse(bText);
      } else {
        const uint8array = new Uint8Array(Base64.toArrayBuffer(txt));
        array.buffer = new ArrayBuffer(uint8array.length);

        // copy uint8array to buffer
        const view = new Uint8Array(array.buffer);
        view.set(uint8array);
        if (options.compression) {
          if (array.dataType === 'string' || array.dataType === 'JSON') {
            array.buffer = strFromU8(decompressSync(new Uint8Array(array.buffer)));
          } else {
            array.buffer = decompressSync(new Uint8Array(array.buffer)).buffer;
          }
        }
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
          vtkErrorMacro(`Error in FetchArray: ${array.name} does not have the proper array size. Got ${array.values.length}, instead of ${array.size}`);
        }
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
    }
  });
}

// ----------------------------------------------------------------------------

function fetchImage(instance, url) {
  return new Promise((resolve, reject) => {
    const img = getElement(url);
    if (img) {
      resolve(img);
    } else {
      reject(new Error(`No such image ${url}`));
    }
  });
}

// ----------------------------------------------------------------------------

const HtmlDataAccessHelper = {
  fetchJSON,
  fetchText,
  fetchArray,
  fetchImage
};
registerType('html', options => HtmlDataAccessHelper);

export { HtmlDataAccessHelper as default };
