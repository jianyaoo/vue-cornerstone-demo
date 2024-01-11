import { PixelDataTypedArray, PixelDataTypedArrayString } from '../types';
declare function getBufferConfiguration(targetBufferType: PixelDataTypedArrayString, length: number, options?: {
    use16BitTexture?: boolean;
    isVolumeBuffer?: boolean;
}): {
    numBytes: number;
    TypedArrayConstructor: new (length: number | SharedArrayBuffer) => PixelDataTypedArray;
};
export { getBufferConfiguration };
