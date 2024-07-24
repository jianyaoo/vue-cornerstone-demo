import '@kitware/vtk.js/Rendering/Profiles/Volume';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import { ImageVolume } from '../cache/classes/ImageVolume';
import cache from '../cache/cache';
import Events from '../enums/Events';
import eventTarget from '../eventTarget';
import triggerEvent from '../utilities/triggerEvent';
import cloneDeep from 'lodash.clonedeep';
import { createUint16SharedArray, createUint8SharedArray, createFloat32SharedArray, generateVolumePropsFromImageIds, getBufferConfiguration, uuidv4, } from '../utilities';
import { getConfiguration, getShouldUseSharedArrayBuffer } from '../init';
import { performCacheOptimizationForVolume, setupCacheOptimizationEventListener, } from '../utilities/cacheUtils';
function addScalarDataToImageData(imageData, scalarData, dataArrayAttrs) {
    const scalarArray = vtkDataArray.newInstance({
        name: `Pixels`,
        values: scalarData,
        ...dataArrayAttrs,
    });
    imageData.getPointData().setScalars(scalarArray);
}
function addScalarDataArraysToImageData(imageData, scalarDataArrays, dataArrayAttrs) {
    scalarDataArrays.forEach((scalarData, i) => {
        const vtkScalarArray = vtkDataArray.newInstance({
            name: `timePoint-${i}`,
            values: scalarData,
            ...dataArrayAttrs,
        });
        imageData.getPointData().addArray(vtkScalarArray);
    });
    imageData.getPointData().setActiveScalars('timePoint-0');
}
function createInternalVTKRepresentation(volume) {
    const { dimensions, metadata, spacing, direction, origin } = volume;
    const { PhotometricInterpretation } = metadata;
    let numComponents = 1;
    if (PhotometricInterpretation === 'RGB') {
        numComponents = 3;
    }
    const imageData = vtkImageData.newInstance();
    const dataArrayAttrs = { numberOfComponents: numComponents };
    imageData.setDimensions(dimensions);
    imageData.setSpacing(spacing);
    imageData.setDirection(direction);
    imageData.setOrigin(origin);
    if (volume.isDynamicVolume()) {
        const scalarDataArrays = (volume).getScalarDataArrays();
        addScalarDataArraysToImageData(imageData, scalarDataArrays, dataArrayAttrs);
    }
    else {
        const scalarData = volume.getScalarData();
        addScalarDataToImageData(imageData, scalarData, dataArrayAttrs);
    }
    return imageData;
}
const volumeLoaders = {};
let unknownVolumeLoader;
function loadVolumeFromVolumeLoader(volumeId, options) {
    const colonIndex = volumeId.indexOf(':');
    const scheme = volumeId.substring(0, colonIndex);
    let loader = volumeLoaders[scheme];
    if (loader === undefined || loader === null) {
        if (unknownVolumeLoader == null ||
            typeof unknownVolumeLoader !== 'function') {
            throw new Error(`No volume loader for scheme ${scheme} has been registered`);
        }
        loader = unknownVolumeLoader;
    }
    const volumeLoadObject = loader(volumeId, options);
    setupCacheOptimizationEventListener(volumeId);
    volumeLoadObject.promise.then(function (volume) {
        triggerEvent(eventTarget, Events.VOLUME_LOADED, { volume });
    }, function (error) {
        const errorObject = {
            volumeId,
            error,
        };
        triggerEvent(eventTarget, Events.VOLUME_LOADED_FAILED, errorObject);
    });
    return volumeLoadObject;
}
export function loadVolume(volumeId, options = { imageIds: [] }) {
    if (volumeId === undefined) {
        throw new Error('loadVolume: parameter volumeId must not be undefined');
    }
    let volumeLoadObject = cache.getVolumeLoadObject(volumeId);
    if (volumeLoadObject !== undefined) {
        return volumeLoadObject.promise;
    }
    volumeLoadObject = loadVolumeFromVolumeLoader(volumeId, options);
    return volumeLoadObject.promise.then((volume) => {
        volume.imageData = createInternalVTKRepresentation(volume);
        return volume;
    });
}
export async function createAndCacheVolume(volumeId, options) {
    if (volumeId === undefined) {
        throw new Error('createAndCacheVolume: parameter volumeId must not be undefined');
    }
    let volumeLoadObject = cache.getVolumeLoadObject(volumeId);
    if (volumeLoadObject !== undefined) {
        return volumeLoadObject.promise;
    }
    volumeLoadObject = loadVolumeFromVolumeLoader(volumeId, options);
    volumeLoadObject.promise.then((volume) => {
        volume.imageData = createInternalVTKRepresentation(volume);
    });
    cache.putVolumeLoadObject(volumeId, volumeLoadObject).catch((err) => {
        throw err;
    });
    return volumeLoadObject.promise;
}
export async function createAndCacheDerivedVolume(referencedVolumeId, options) {
    const referencedVolume = cache.getVolume(referencedVolumeId);
    if (!referencedVolume) {
        throw new Error(`Cannot created derived volume: Referenced volume with id ${referencedVolumeId} does not exist.`);
    }
    let { volumeId } = options;
    const { targetBuffer } = options;
    if (volumeId === undefined) {
        volumeId = uuidv4();
    }
    const { metadata, dimensions, spacing, origin, direction } = referencedVolume;
    const scalarData = referencedVolume.getScalarData();
    const scalarLength = scalarData.length;
    const { volumeScalarData, numBytes } = generateVolumeScalarData(targetBuffer, scalarLength);
    const scalarArray = vtkDataArray.newInstance({
        name: 'Pixels',
        numberOfComponents: 1,
        values: volumeScalarData,
    });
    const derivedImageData = vtkImageData.newInstance();
    derivedImageData.setDimensions(dimensions);
    derivedImageData.setSpacing(spacing);
    derivedImageData.setDirection(direction);
    derivedImageData.setOrigin(origin);
    derivedImageData.getPointData().setScalars(scalarArray);
    const derivedVolume = new ImageVolume({
        volumeId,
        metadata: cloneDeep(metadata),
        dimensions: [dimensions[0], dimensions[1], dimensions[2]],
        spacing,
        origin,
        direction,
        imageData: derivedImageData,
        scalarData: volumeScalarData,
        sizeInBytes: numBytes,
        imageIds: [],
        referencedVolumeId,
    });
    const volumeLoadObject = {
        promise: Promise.resolve(derivedVolume),
    };
    await cache.putVolumeLoadObject(volumeId, volumeLoadObject);
    return derivedVolume;
}
export function createLocalVolume(options, volumeId, preventCache = false) {
    const { metadata, dimensions, spacing, origin, direction, targetBuffer } = options;
    let { scalarData } = options;
    const validDataTypes = [
        'Uint8Array',
        'Float32Array',
        'Uint16Array',
        'Int16Array',
    ];
    const scalarLength = dimensions[0] * dimensions[1] * dimensions[2];
    if (!scalarData || !validDataTypes.includes(scalarData.constructor.name)) {
        if (!targetBuffer?.type || !validDataTypes.includes(targetBuffer.type)) {
            throw new Error('createLocalVolume: parameter scalarData must be provided and must be either Uint8Array, Float32Array, Uint16Array or Int16Array');
        }
        ({ volumeScalarData: scalarData } = generateVolumeScalarData(targetBuffer, scalarLength));
    }
    if (volumeId === undefined) {
        volumeId = uuidv4();
    }
    const cachedVolume = cache.getVolume(volumeId);
    if (cachedVolume) {
        return cachedVolume;
    }
    const numBytes = scalarData ? scalarData.buffer.byteLength : scalarLength * 4;
    const isCacheable = cache.isCacheable(numBytes);
    if (!isCacheable) {
        throw new Error(Events.CACHE_SIZE_EXCEEDED);
    }
    const scalarArray = vtkDataArray.newInstance({
        name: 'Pixels',
        numberOfComponents: 1,
        values: scalarData,
    });
    const imageData = vtkImageData.newInstance();
    imageData.setDimensions(dimensions);
    imageData.setSpacing(spacing);
    imageData.setDirection(direction);
    imageData.setOrigin(origin);
    imageData.getPointData().setScalars(scalarArray);
    const derivedVolume = new ImageVolume({
        volumeId,
        metadata: cloneDeep(metadata),
        dimensions: [dimensions[0], dimensions[1], dimensions[2]],
        spacing,
        origin,
        direction,
        imageData: imageData,
        scalarData,
        sizeInBytes: numBytes,
        referencedImageIds: options.referencedImageIds || [],
        referencedVolumeId: options.referencedVolumeId,
        imageIds: options.imageIds || [],
    });
    if (preventCache) {
        return derivedVolume;
    }
    const volumeLoadObject = {
        promise: Promise.resolve(derivedVolume),
    };
    cache.putVolumeLoadObject(volumeId, volumeLoadObject);
    return derivedVolume;
}
export async function createAndCacheVolumeFromImages(volumeId, imageIds, options = {}) {
    const { preventCache = false } = options;
    if (imageIds === undefined) {
        throw new Error('createAndCacheVolumeFromImages: parameter imageIds must not be undefined');
    }
    if (volumeId === undefined) {
        throw new Error('createAndCacheVolumeFromImages: parameter volumeId must not be undefined');
    }
    const cachedVolume = cache.getVolume(volumeId);
    if (cachedVolume) {
        return Promise.resolve(cachedVolume);
    }
    const volumeProps = generateVolumePropsFromImageIds(imageIds, volumeId);
    const imagePromises = volumeProps.imageIds.map((imageId, imageIdIndex) => {
        const imageLoadObject = cache.getImageLoadObject(imageId);
        return imageLoadObject.promise.then((image) => {
            const pixelData = image.getPixelData();
            const offset = imageIdIndex * image.rows * image.columns;
            volumeProps.scalarData.set(pixelData, offset);
        });
    });
    await Promise.all(imagePromises);
    const volume = new ImageVolume({
        ...volumeProps,
        referencedImageIds: imageIds,
        ...options,
    });
    performCacheOptimizationForVolume(volume);
    const volumeLoadObject = {
        promise: Promise.resolve(volume),
    };
    if (preventCache) {
        return volumeLoadObject.promise;
    }
    cache.putVolumeLoadObject(volumeId, volumeLoadObject);
    return volumeLoadObject.promise;
}
export function registerVolumeLoader(scheme, volumeLoader) {
    volumeLoaders[scheme] = volumeLoader;
}
export function getVolumeLoaderSchemes() {
    return Object.keys(volumeLoaders);
}
export function registerUnknownVolumeLoader(volumeLoader) {
    const oldVolumeLoader = unknownVolumeLoader;
    unknownVolumeLoader = volumeLoader;
    return oldVolumeLoader;
}
export function getUnknownVolumeLoaderSchema() {
    return unknownVolumeLoader.name;
}
export async function createAndCacheDerivedSegmentationVolume(referencedVolumeId, options = {}) {
    return createAndCacheDerivedVolume(referencedVolumeId, {
        ...options,
        targetBuffer: {
            type: 'Uint8Array',
        },
    });
}
export async function createLocalSegmentationVolume(options, volumeId, preventCache = false) {
    if (!options.scalarData) {
        options.scalarData = new Uint8Array(options.dimensions[0] * options.dimensions[1] * options.dimensions[2]);
    }
    return createLocalVolume(options, volumeId, preventCache);
}
function generateVolumeScalarData(targetBuffer, scalarLength) {
    const { useNorm16Texture } = getConfiguration().rendering;
    const { TypedArrayConstructor, numBytes } = getBufferConfiguration(targetBuffer?.type, scalarLength, {
        use16BitTexture: useNorm16Texture,
        isVolumeBuffer: true,
    });
    const isCacheable = cache.isCacheable(numBytes);
    if (!isCacheable) {
        throw new Error(Events.CACHE_SIZE_EXCEEDED);
    }
    let volumeScalarData;
    if (targetBuffer?.sharedArrayBuffer ?? getShouldUseSharedArrayBuffer()) {
        switch (targetBuffer.type) {
            case 'Float32Array':
                volumeScalarData = createFloat32SharedArray(scalarLength);
                break;
            case 'Uint8Array':
                volumeScalarData = createUint8SharedArray(scalarLength);
                break;
            case 'Uint16Array':
                volumeScalarData = createUint16SharedArray(scalarLength);
                break;
            case 'Int16Array':
                volumeScalarData = createUint16SharedArray(scalarLength);
                break;
            default:
                throw new Error('generateVolumeScalarData: SharedArrayBuffer is not supported for the specified target buffer type');
        }
    }
    else {
        volumeScalarData = new TypedArrayConstructor(scalarLength);
    }
    return { volumeScalarData, numBytes };
}
//# sourceMappingURL=volumeLoader.js.map