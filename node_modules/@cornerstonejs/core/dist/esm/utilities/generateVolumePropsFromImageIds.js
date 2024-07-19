import { vec3 } from 'gl-matrix';
import { canRenderFloatTextures, getConfiguration, getShouldUseSharedArrayBuffer, } from '../init';
import createFloat32SharedArray from './createFloat32SharedArray';
import createInt16SharedArray from './createInt16SharedArray';
import createUint16SharedArray from './createUInt16SharedArray';
import createUint8SharedArray from './createUint8SharedArray';
import getScalingParameters from './getScalingParameters';
import makeVolumeMetadata from './makeVolumeMetadata';
import sortImageIdsAndGetSpacing from './sortImageIdsAndGetSpacing';
import { hasFloatScalingParameters } from './hasFloatScalingParameters';
import cache from '../cache';
import { Events } from '../enums';
function generateVolumePropsFromImageIds(imageIds, volumeId) {
    const { useNorm16Texture, preferSizeOverAccuracy } = getConfiguration().rendering;
    const use16BitDataType = useNorm16Texture || preferSizeOverAccuracy;
    const volumeMetadata = makeVolumeMetadata(imageIds);
    const imageIdIndex = Math.floor(imageIds.length / 2);
    const imageId = imageIds[imageIdIndex];
    const scalingParameters = getScalingParameters(imageId);
    const hasNegativeRescale = scalingParameters.rescaleIntercept < 0 ||
        scalingParameters.rescaleSlope < 0;
    const floatAfterScale = hasFloatScalingParameters(scalingParameters);
    const canRenderFloat = canRenderFloatTextures();
    const { BitsAllocated, PixelRepresentation, PhotometricInterpretation, ImageOrientationPatient, PixelSpacing, Columns, Rows, } = volumeMetadata;
    const rowCosineVec = vec3.fromValues(ImageOrientationPatient[0], ImageOrientationPatient[1], ImageOrientationPatient[2]);
    const colCosineVec = vec3.fromValues(ImageOrientationPatient[3], ImageOrientationPatient[4], ImageOrientationPatient[5]);
    const scanAxisNormal = vec3.create();
    vec3.cross(scanAxisNormal, rowCosineVec, colCosineVec);
    const { zSpacing, origin, sortedImageIds } = sortImageIdsAndGetSpacing(imageIds, scanAxisNormal);
    const numFrames = imageIds.length;
    const spacing = [PixelSpacing[1], PixelSpacing[0], zSpacing];
    const dimensions = [Columns, Rows, numFrames];
    const direction = [
        ...rowCosineVec,
        ...colCosineVec,
        ...scanAxisNormal,
    ];
    const signed = PixelRepresentation === 1;
    const numComponents = PhotometricInterpretation === 'RGB' ? 3 : 1;
    const useSharedArrayBuffer = getShouldUseSharedArrayBuffer();
    const length = dimensions[0] * dimensions[1] * dimensions[2];
    const handleCache = (sizeInBytes) => {
        if (!cache.isCacheable(sizeInBytes)) {
            throw new Error(Events.CACHE_SIZE_EXCEEDED);
        }
        cache.decacheIfNecessaryUntilBytesAvailable(sizeInBytes);
    };
    let scalarData, sizeInBytes;
    switch (BitsAllocated) {
        case 8:
            if (signed) {
                throw new Error('8 Bit signed images are not yet supported by this plugin.');
            }
            sizeInBytes = length * numComponents;
            handleCache(sizeInBytes);
            scalarData = useSharedArrayBuffer
                ? createUint8SharedArray(length * numComponents)
                : new Uint8Array(length * numComponents);
            break;
        case 16:
            if (!use16BitDataType || (canRenderFloat && floatAfterScale)) {
                sizeInBytes = length * 4;
                scalarData = useSharedArrayBuffer
                    ? createFloat32SharedArray(length)
                    : new Float32Array(length);
                break;
            }
            sizeInBytes = length * 2;
            if (signed || hasNegativeRescale) {
                handleCache(sizeInBytes);
                scalarData = useSharedArrayBuffer
                    ? createInt16SharedArray(length)
                    : new Int16Array(length);
                break;
            }
            if (!signed && !hasNegativeRescale) {
                handleCache(sizeInBytes);
                scalarData = useSharedArrayBuffer
                    ? createUint16SharedArray(length)
                    : new Uint16Array(length);
                break;
            }
            sizeInBytes = length * 4;
            handleCache(sizeInBytes);
            scalarData = useSharedArrayBuffer
                ? createFloat32SharedArray(length)
                : new Float32Array(length);
            break;
        case 24:
            sizeInBytes = length * numComponents;
            handleCache(sizeInBytes);
            scalarData = useSharedArrayBuffer
                ? createUint8SharedArray(length * numComponents)
                : new Uint8Array(length * numComponents);
            break;
        case 32:
            sizeInBytes = length * 4;
            handleCache(sizeInBytes);
            scalarData = useSharedArrayBuffer
                ? createFloat32SharedArray(length)
                : new Float32Array(length);
            break;
        default:
            throw new Error(`Bits allocated of ${BitsAllocated} is not defined to generate scalarData for the volume.`);
    }
    return {
        dimensions,
        spacing,
        origin,
        direction,
        scalarData,
        sizeInBytes,
        metadata: volumeMetadata,
        imageIds: sortedImageIds,
        volumeId,
    };
}
export { generateVolumePropsFromImageIds };
//# sourceMappingURL=generateVolumePropsFromImageIds.js.map