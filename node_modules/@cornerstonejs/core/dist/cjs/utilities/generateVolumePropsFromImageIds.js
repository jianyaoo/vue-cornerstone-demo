"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVolumePropsFromImageIds = void 0;
const gl_matrix_1 = require("gl-matrix");
const init_1 = require("../init");
const createFloat32SharedArray_1 = __importDefault(require("./createFloat32SharedArray"));
const createInt16SharedArray_1 = __importDefault(require("./createInt16SharedArray"));
const createUInt16SharedArray_1 = __importDefault(require("./createUInt16SharedArray"));
const createUint8SharedArray_1 = __importDefault(require("./createUint8SharedArray"));
const getScalingParameters_1 = __importDefault(require("./getScalingParameters"));
const makeVolumeMetadata_1 = __importDefault(require("./makeVolumeMetadata"));
const sortImageIdsAndGetSpacing_1 = __importDefault(require("./sortImageIdsAndGetSpacing"));
const hasFloatScalingParameters_1 = require("./hasFloatScalingParameters");
const cache_1 = __importDefault(require("../cache"));
const enums_1 = require("../enums");
function generateVolumePropsFromImageIds(imageIds, volumeId) {
    const { useNorm16Texture, preferSizeOverAccuracy } = (0, init_1.getConfiguration)().rendering;
    const use16BitDataType = useNorm16Texture || preferSizeOverAccuracy;
    const volumeMetadata = (0, makeVolumeMetadata_1.default)(imageIds);
    const imageIdIndex = Math.floor(imageIds.length / 2);
    const imageId = imageIds[imageIdIndex];
    const scalingParameters = (0, getScalingParameters_1.default)(imageId);
    const hasNegativeRescale = scalingParameters.rescaleIntercept < 0 ||
        scalingParameters.rescaleSlope < 0;
    const floatAfterScale = (0, hasFloatScalingParameters_1.hasFloatScalingParameters)(scalingParameters);
    const canRenderFloat = (0, init_1.canRenderFloatTextures)();
    const { BitsAllocated, PixelRepresentation, PhotometricInterpretation, ImageOrientationPatient, PixelSpacing, Columns, Rows, } = volumeMetadata;
    const rowCosineVec = gl_matrix_1.vec3.fromValues(ImageOrientationPatient[0], ImageOrientationPatient[1], ImageOrientationPatient[2]);
    const colCosineVec = gl_matrix_1.vec3.fromValues(ImageOrientationPatient[3], ImageOrientationPatient[4], ImageOrientationPatient[5]);
    const scanAxisNormal = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.cross(scanAxisNormal, rowCosineVec, colCosineVec);
    const { zSpacing, origin, sortedImageIds } = (0, sortImageIdsAndGetSpacing_1.default)(imageIds, scanAxisNormal);
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
    const useSharedArrayBuffer = (0, init_1.getShouldUseSharedArrayBuffer)();
    const length = dimensions[0] * dimensions[1] * dimensions[2];
    const handleCache = (sizeInBytes) => {
        if (!cache_1.default.isCacheable(sizeInBytes)) {
            throw new Error(enums_1.Events.CACHE_SIZE_EXCEEDED);
        }
        cache_1.default.decacheIfNecessaryUntilBytesAvailable(sizeInBytes);
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
                ? (0, createUint8SharedArray_1.default)(length * numComponents)
                : new Uint8Array(length * numComponents);
            break;
        case 16:
            if (!use16BitDataType || (canRenderFloat && floatAfterScale)) {
                sizeInBytes = length * 4;
                scalarData = useSharedArrayBuffer
                    ? (0, createFloat32SharedArray_1.default)(length)
                    : new Float32Array(length);
                break;
            }
            sizeInBytes = length * 2;
            if (signed || hasNegativeRescale) {
                handleCache(sizeInBytes);
                scalarData = useSharedArrayBuffer
                    ? (0, createInt16SharedArray_1.default)(length)
                    : new Int16Array(length);
                break;
            }
            if (!signed && !hasNegativeRescale) {
                handleCache(sizeInBytes);
                scalarData = useSharedArrayBuffer
                    ? (0, createUInt16SharedArray_1.default)(length)
                    : new Uint16Array(length);
                break;
            }
            sizeInBytes = length * 4;
            handleCache(sizeInBytes);
            scalarData = useSharedArrayBuffer
                ? (0, createFloat32SharedArray_1.default)(length)
                : new Float32Array(length);
            break;
        case 24:
            sizeInBytes = length * numComponents;
            handleCache(sizeInBytes);
            scalarData = useSharedArrayBuffer
                ? (0, createUint8SharedArray_1.default)(length * numComponents)
                : new Uint8Array(length * numComponents);
            break;
        case 32:
            sizeInBytes = length * 4;
            handleCache(sizeInBytes);
            scalarData = useSharedArrayBuffer
                ? (0, createFloat32SharedArray_1.default)(length)
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
exports.generateVolumePropsFromImageIds = generateVolumePropsFromImageIds;
//# sourceMappingURL=generateVolumePropsFromImageIds.js.map