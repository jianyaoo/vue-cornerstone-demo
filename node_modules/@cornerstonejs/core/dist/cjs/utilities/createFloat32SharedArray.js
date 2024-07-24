"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../init");
const SMALL_MEMORY_LIMIT = 2 * 1024 * 1024 * 1024 - 2;
const BIG_MEMORY_LIMIT = SMALL_MEMORY_LIMIT * 2;
const PAGE_SIZE = 65536;
function createFloat32SharedArray(length) {
    if (!(0, init_1.getShouldUseSharedArrayBuffer)()) {
        throw new Error('Your page is NOT cross-origin isolated, see https://developer.mozilla.org/en-US/docs/Web/API/crossOriginIsolated');
    }
    if (window.SharedArrayBuffer === undefined) {
        throw new Error('SharedArrayBuffer is NOT supported in your browser see https://developer.chrome.com/blog/enabling-shared-array-buffer/');
    }
    const byteLength = length * 4;
    if (byteLength < SMALL_MEMORY_LIMIT) {
        const sharedArrayBuffer = new SharedArrayBuffer(byteLength);
        return new Float32Array(sharedArrayBuffer);
    }
    else if (byteLength < BIG_MEMORY_LIMIT) {
        const pages = Math.ceil(byteLength / PAGE_SIZE);
        const memory = new WebAssembly.Memory({
            initial: pages,
            maximum: pages,
            shared: true,
        });
        return new Float32Array(memory.buffer, 0, length);
    }
}
exports.default = createFloat32SharedArray;
//# sourceMappingURL=createFloat32SharedArray.js.map