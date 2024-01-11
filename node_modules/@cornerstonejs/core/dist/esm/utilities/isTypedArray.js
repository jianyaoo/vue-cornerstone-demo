export default function isTypedArray(obj) {
    return (obj instanceof Int8Array ||
        obj instanceof Uint8Array ||
        obj instanceof Uint8ClampedArray ||
        obj instanceof Int16Array ||
        obj instanceof Uint16Array ||
        obj instanceof Int32Array ||
        obj instanceof Uint32Array ||
        obj instanceof Float32Array ||
        obj instanceof Float64Array);
}
//# sourceMappingURL=isTypedArray.js.map