function createUint16SharedArray(length) {
    if (!window.crossOriginIsolated) {
        throw new Error('Your page is NOT cross-origin isolated, see https://developer.mozilla.org/en-US/docs/Web/API/crossOriginIsolated');
    }
    if (window.SharedArrayBuffer === undefined) {
        throw new Error('SharedArrayBuffer is NOT supported in your browser see https://developer.chrome.com/blog/enabling-shared-array-buffer/');
    }
    const sharedArrayBuffer = new SharedArrayBuffer(length * 2);
    return new Uint16Array(sharedArrayBuffer);
}
export default createUint16SharedArray;
//# sourceMappingURL=createUInt16SharedArray.js.map