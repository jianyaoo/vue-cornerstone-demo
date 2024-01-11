"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../init");
function createUint8SharedArray(length) {
    if (!(0, init_1.getShouldUseSharedArrayBuffer)()) {
        throw new Error('Your page is NOT cross-origin isolated, see https://developer.mozilla.org/en-US/docs/Web/API/crossOriginIsolated');
    }
    if (window.SharedArrayBuffer === undefined) {
        throw new Error('SharedArrayBuffer is NOT supported in your browser see https://developer.chrome.com/blog/enabling-shared-array-buffer/');
    }
    const sharedArrayBuffer = new SharedArrayBuffer(length);
    return new Uint8Array(sharedArrayBuffer);
}
exports.default = createUint8SharedArray;
//# sourceMappingURL=createUint8SharedArray.js.map