function getBufferConfiguration(targetBufferType, length, options = {}) {
    const { use16BitTexture = false, isVolumeBuffer = false } = options;
    switch (targetBufferType) {
        case 'Float32Array':
            return { numBytes: length * 4, TypedArrayConstructor: Float32Array };
        case 'Uint8Array':
            return { numBytes: length, TypedArrayConstructor: Uint8Array };
        case 'Uint16Array':
            if (!isVolumeBuffer) {
                return { numBytes: length * 2, TypedArrayConstructor: Uint16Array };
            }
            else {
                if (use16BitTexture) {
                    return { numBytes: length * 2, TypedArrayConstructor: Uint16Array };
                }
                else {
                    console.warn('Uint16Array is not supported for volume rendering, switching back to Float32Array');
                    return { numBytes: length * 4, TypedArrayConstructor: Float32Array };
                }
            }
        case 'Int16Array':
            if (!isVolumeBuffer) {
                return { numBytes: length * 2, TypedArrayConstructor: Int16Array };
            }
            else {
                if (use16BitTexture) {
                    return { numBytes: length * 2, TypedArrayConstructor: Int16Array };
                }
                else {
                    console.warn('Int16Array is not supported for volume rendering, switching back to Float32Array');
                    return { numBytes: length * 4, TypedArrayConstructor: Float32Array };
                }
            }
        default:
            if (targetBufferType) {
                throw new Error('TargetBuffer should be Float32Array, Uint8Array, Uint16Array, or Int16Array');
            }
            else {
                return { numBytes: length * 4, TypedArrayConstructor: Float32Array };
            }
    }
}
export { getBufferConfiguration };
//# sourceMappingURL=getBufferConfiguration.js.map