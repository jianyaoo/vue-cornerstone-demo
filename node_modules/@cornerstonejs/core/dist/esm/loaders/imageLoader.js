import cache from '../cache/cache';
import { ImageVolume } from '../cache';
import Events from '../enums/Events';
import eventTarget from '../eventTarget';
import { genericMetadataProvider, getBufferConfiguration, triggerEvent, uuidv4, } from '../utilities';
import imageLoadPoolManager from '../requestPool/imageLoadPoolManager';
import { metaData } from '../';
const imageLoaders = {};
let unknownImageLoader;
function loadImageFromImageLoader(imageId, options) {
    const colonIndex = imageId.indexOf(':');
    const scheme = imageId.substring(0, colonIndex);
    const loader = imageLoaders[scheme];
    if (loader === undefined || loader === null) {
        if (unknownImageLoader !== undefined) {
            return unknownImageLoader(imageId);
        }
        throw new Error('loadImageFromImageLoader: no image loader for imageId');
    }
    const imageLoadObject = loader(imageId, options);
    imageLoadObject.promise.then(function (image) {
        triggerEvent(eventTarget, Events.IMAGE_LOADED, { image });
    }, function (error) {
        const errorObject = {
            imageId,
            error,
        };
        triggerEvent(eventTarget, Events.IMAGE_LOAD_FAILED, errorObject);
    });
    return imageLoadObject;
}
function loadImageFromCacheOrVolume(imageId, options) {
    if (options.ignoreCache) {
        return loadImageFromImageLoader(imageId, options);
    }
    let imageLoadObject = cache.getImageLoadObject(imageId);
    if (imageLoadObject !== undefined) {
        return imageLoadObject;
    }
    const cachedVolumeInfo = cache.getVolumeContainingImageId(imageId);
    if (cachedVolumeInfo?.volume?.loadStatus?.loaded) {
        const { volume, imageIdIndex } = cachedVolumeInfo;
        if (volume instanceof ImageVolume) {
            imageLoadObject = volume.convertToCornerstoneImage(imageId, imageIdIndex);
        }
        return imageLoadObject;
    }
    const cachedImage = cache.getCachedImageBasedOnImageURI(imageId);
    if (cachedImage) {
        imageLoadObject = cachedImage.imageLoadObject;
        return imageLoadObject;
    }
    imageLoadObject = loadImageFromImageLoader(imageId, options);
    return imageLoadObject;
}
export function loadImage(imageId, options = { priority: 0, requestType: 'prefetch' }) {
    if (imageId === undefined) {
        throw new Error('loadImage: parameter imageId must not be undefined');
    }
    return loadImageFromCacheOrVolume(imageId, options).promise;
}
export function loadAndCacheImage(imageId, options = { priority: 0, requestType: 'prefetch' }) {
    if (imageId === undefined) {
        throw new Error('loadAndCacheImage: parameter imageId must not be undefined');
    }
    const imageLoadObject = loadImageFromCacheOrVolume(imageId, options);
    if (!cache.getImageLoadObject(imageId)) {
        cache.putImageLoadObject(imageId, imageLoadObject).catch((err) => {
            console.warn(err);
        });
    }
    return imageLoadObject.promise;
}
export function loadAndCacheImages(imageIds, options = { priority: 0, requestType: 'prefetch' }) {
    if (!imageIds || imageIds.length === 0) {
        throw new Error('loadAndCacheImages: parameter imageIds must be list of image Ids');
    }
    const allPromises = imageIds.map((imageId) => {
        return loadAndCacheImage(imageId, options);
    });
    return allPromises;
}
export function createAndCacheDerivedImage(referencedImageId, options = {}, preventCache = false) {
    if (referencedImageId === undefined) {
        throw new Error('createAndCacheDerivedImage: parameter imageId must not be undefined');
    }
    if (options.imageId === undefined) {
        options.imageId = `derived:${uuidv4()}`;
    }
    const { imageId, skipCreateBuffer, onCacheAdd } = options;
    const imagePlaneModule = metaData.get('imagePlaneModule', referencedImageId);
    const length = imagePlaneModule.rows * imagePlaneModule.columns;
    const { TypedArrayConstructor } = getBufferConfiguration(options.targetBufferType, length);
    const imageScalarData = new TypedArrayConstructor(skipCreateBuffer ? 1 : length);
    const derivedImageId = imageId;
    ['imagePlaneModule', 'generalSeriesModule'].forEach((type) => {
        genericMetadataProvider.add(derivedImageId, {
            type,
            metadata: metaData.get(type, referencedImageId),
        });
    });
    const imagePixelModule = metaData.get('imagePixelModule', referencedImageId);
    genericMetadataProvider.add(derivedImageId, {
        type: 'imagePixelModule',
        metadata: {
            ...imagePixelModule,
            bitsAllocated: 8,
            bitsStored: 8,
            highBit: 7,
            samplesPerPixel: 1,
            pixelRepresentation: 0,
        },
    });
    const localImage = createAndCacheLocalImage({ scalarData: imageScalarData, onCacheAdd, skipCreateBuffer }, imageId, true);
    const imageLoadObject = {
        promise: Promise.resolve(localImage),
    };
    if (!preventCache) {
        cache.putImageLoadObject(derivedImageId, imageLoadObject);
    }
    return imageLoadObject.promise;
}
export function createAndCacheDerivedImages(referencedImageIds, options = {}) {
    if (referencedImageIds?.length === 0) {
        throw new Error('createAndCacheDerivedImages: parameter imageIds must be list of image Ids');
    }
    const derivedImageIds = [];
    const allPromises = referencedImageIds.map((referencedImageId) => {
        const newOptions = {
            imageId: options.getDerivedImageId?.(referencedImageId) || `derived:${uuidv4()}`,
            ...options,
        };
        derivedImageIds.push(newOptions.imageId);
        return createAndCacheDerivedImage(referencedImageId, newOptions);
    });
    return { imageIds: derivedImageIds, promises: allPromises };
}
export function createAndCacheLocalImage(options, imageId, preventCache = false) {
    const imagePlaneModule = metaData.get('imagePlaneModule', imageId);
    const length = imagePlaneModule.rows * imagePlaneModule.columns;
    const image = {
        imageId: imageId,
        intercept: 0,
        windowCenter: 0,
        windowWidth: 0,
        color: false,
        numComps: 1,
        slope: 1,
        minPixelValue: 0,
        maxPixelValue: 255,
        voiLUTFunction: undefined,
        rows: imagePlaneModule.rows,
        columns: imagePlaneModule.columns,
        getCanvas: undefined,
        height: imagePlaneModule.rows,
        width: imagePlaneModule.columns,
        rgba: undefined,
        columnPixelSpacing: imagePlaneModule.columnPixelSpacing,
        rowPixelSpacing: imagePlaneModule.rowPixelSpacing,
        invert: false,
    };
    if (options.scalarData) {
        const imageScalarData = options.scalarData;
        if (!(imageScalarData instanceof Uint8Array ||
            imageScalarData instanceof Float32Array ||
            imageScalarData instanceof Uint16Array ||
            imageScalarData instanceof Int16Array)) {
            throw new Error('To use createLocalVolume you should pass scalarData of type Uint8Array, Uint16Array, Int16Array or Float32Array');
        }
        image.sizeInBytes = imageScalarData.byteLength;
        image.getPixelData = () => imageScalarData;
    }
    else if (options.skipCreateBuffer !== true) {
        const { numBytes, TypedArrayConstructor } = getBufferConfiguration(options.targetBufferType, length);
        const imageScalarData = new TypedArrayConstructor(length);
        image.sizeInBytes = numBytes;
        image.getPixelData = () => imageScalarData;
    }
    options.onCacheAdd?.(image);
    const imageLoadObject = {
        promise: Promise.resolve(image),
    };
    if (!preventCache) {
        cache.putImageLoadObject(image.imageId, imageLoadObject);
    }
    return image;
}
export function cancelLoadImage(imageId) {
    const filterFunction = ({ additionalDetails }) => {
        if (additionalDetails.imageId) {
            return additionalDetails.imageId !== imageId;
        }
        return true;
    };
    imageLoadPoolManager.filterRequests(filterFunction);
    const imageLoadObject = cache.getImageLoadObject(imageId);
    if (imageLoadObject) {
        imageLoadObject.cancelFn();
    }
}
export function cancelLoadImages(imageIds) {
    imageIds.forEach((imageId) => cancelLoadImage(imageId));
}
export function cancelLoadAll() {
    const requestPool = imageLoadPoolManager.getRequestPool();
    Object.keys(requestPool).forEach((type) => {
        const requests = requestPool[type];
        Object.keys(requests).forEach((priority) => {
            const requestDetails = requests[priority].pop();
            const additionalDetails = requestDetails.additionalDetails;
            const { imageId, volumeId } = additionalDetails;
            let loadObject;
            if (imageId) {
                loadObject = cache.getImageLoadObject(imageId);
            }
            else if (volumeId) {
                loadObject = cache.getVolumeLoadObject(volumeId);
            }
            if (loadObject) {
                loadObject.cancel();
            }
        });
        imageLoadPoolManager.clearRequestStack(type);
    });
}
export function registerImageLoader(scheme, imageLoader) {
    imageLoaders[scheme] = imageLoader;
}
export function registerUnknownImageLoader(imageLoader) {
    const oldImageLoader = unknownImageLoader;
    unknownImageLoader = imageLoader;
    return oldImageLoader;
}
export function unregisterAllImageLoaders() {
    Object.keys(imageLoaders).forEach((imageLoader) => delete imageLoaders[imageLoader]);
    unknownImageLoader = undefined;
}
export function createAndCacheDerivedSegmentationImages(referencedImageIds, options = {
    targetBufferType: 'Uint8Array',
}) {
    return createAndCacheDerivedImages(referencedImageIds, options);
}
export function createAndCacheDerivedSegmentationImage(referencedImageId, options = {
    targetBufferType: 'Uint8Array',
}) {
    return createAndCacheDerivedImage(referencedImageId, options);
}
//# sourceMappingURL=imageLoader.js.map