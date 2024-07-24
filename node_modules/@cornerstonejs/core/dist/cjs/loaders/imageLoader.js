"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndCacheDerivedSegmentationImage = exports.createAndCacheDerivedSegmentationImages = exports.unregisterAllImageLoaders = exports.registerUnknownImageLoader = exports.registerImageLoader = exports.cancelLoadAll = exports.cancelLoadImages = exports.cancelLoadImage = exports.createAndCacheLocalImage = exports.createAndCacheDerivedImages = exports.createAndCacheDerivedImage = exports.loadAndCacheImages = exports.loadAndCacheImage = exports.loadImage = void 0;
const cache_1 = __importDefault(require("../cache/cache"));
const cache_2 = require("../cache");
const Events_1 = __importDefault(require("../enums/Events"));
const eventTarget_1 = __importDefault(require("../eventTarget"));
const utilities_1 = require("../utilities");
const imageLoadPoolManager_1 = __importDefault(require("../requestPool/imageLoadPoolManager"));
const __1 = require("../");
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
        (0, utilities_1.triggerEvent)(eventTarget_1.default, Events_1.default.IMAGE_LOADED, { image });
    }, function (error) {
        const errorObject = {
            imageId,
            error,
        };
        (0, utilities_1.triggerEvent)(eventTarget_1.default, Events_1.default.IMAGE_LOAD_FAILED, errorObject);
    });
    return imageLoadObject;
}
function loadImageFromCacheOrVolume(imageId, options) {
    var _a, _b;
    if (options.ignoreCache) {
        return loadImageFromImageLoader(imageId, options);
    }
    let imageLoadObject = cache_1.default.getImageLoadObject(imageId);
    if (imageLoadObject !== undefined) {
        return imageLoadObject;
    }
    const cachedVolumeInfo = cache_1.default.getVolumeContainingImageId(imageId);
    if ((_b = (_a = cachedVolumeInfo === null || cachedVolumeInfo === void 0 ? void 0 : cachedVolumeInfo.volume) === null || _a === void 0 ? void 0 : _a.loadStatus) === null || _b === void 0 ? void 0 : _b.loaded) {
        const { volume, imageIdIndex } = cachedVolumeInfo;
        if (volume instanceof cache_2.ImageVolume) {
            imageLoadObject = volume.convertToCornerstoneImage(imageId, imageIdIndex);
        }
        return imageLoadObject;
    }
    const cachedImage = cache_1.default.getCachedImageBasedOnImageURI(imageId);
    if (cachedImage) {
        imageLoadObject = cachedImage.imageLoadObject;
        return imageLoadObject;
    }
    imageLoadObject = loadImageFromImageLoader(imageId, options);
    return imageLoadObject;
}
function loadImage(imageId, options = { priority: 0, requestType: 'prefetch' }) {
    if (imageId === undefined) {
        throw new Error('loadImage: parameter imageId must not be undefined');
    }
    return loadImageFromCacheOrVolume(imageId, options).promise;
}
exports.loadImage = loadImage;
function loadAndCacheImage(imageId, options = { priority: 0, requestType: 'prefetch' }) {
    if (imageId === undefined) {
        throw new Error('loadAndCacheImage: parameter imageId must not be undefined');
    }
    const imageLoadObject = loadImageFromCacheOrVolume(imageId, options);
    if (!cache_1.default.getImageLoadObject(imageId)) {
        cache_1.default.putImageLoadObject(imageId, imageLoadObject).catch((err) => {
            console.warn(err);
        });
    }
    return imageLoadObject.promise;
}
exports.loadAndCacheImage = loadAndCacheImage;
function loadAndCacheImages(imageIds, options = { priority: 0, requestType: 'prefetch' }) {
    if (!imageIds || imageIds.length === 0) {
        throw new Error('loadAndCacheImages: parameter imageIds must be list of image Ids');
    }
    const allPromises = imageIds.map((imageId) => {
        return loadAndCacheImage(imageId, options);
    });
    return allPromises;
}
exports.loadAndCacheImages = loadAndCacheImages;
function createAndCacheDerivedImage(referencedImageId, options = {}, preventCache = false) {
    if (referencedImageId === undefined) {
        throw new Error('createAndCacheDerivedImage: parameter imageId must not be undefined');
    }
    if (options.imageId === undefined) {
        options.imageId = `derived:${(0, utilities_1.uuidv4)()}`;
    }
    const { imageId, skipCreateBuffer, onCacheAdd } = options;
    const imagePlaneModule = __1.metaData.get('imagePlaneModule', referencedImageId);
    const length = imagePlaneModule.rows * imagePlaneModule.columns;
    const { TypedArrayConstructor } = (0, utilities_1.getBufferConfiguration)(options.targetBufferType, length);
    const imageScalarData = new TypedArrayConstructor(skipCreateBuffer ? 1 : length);
    const derivedImageId = imageId;
    ['imagePlaneModule', 'generalSeriesModule'].forEach((type) => {
        utilities_1.genericMetadataProvider.add(derivedImageId, {
            type,
            metadata: __1.metaData.get(type, referencedImageId),
        });
    });
    const imagePixelModule = __1.metaData.get('imagePixelModule', referencedImageId);
    utilities_1.genericMetadataProvider.add(derivedImageId, {
        type: 'imagePixelModule',
        metadata: Object.assign(Object.assign({}, imagePixelModule), { bitsAllocated: 8, bitsStored: 8, highBit: 7, samplesPerPixel: 1, pixelRepresentation: 0 }),
    });
    const localImage = createAndCacheLocalImage({ scalarData: imageScalarData, onCacheAdd, skipCreateBuffer }, imageId, true);
    const imageLoadObject = {
        promise: Promise.resolve(localImage),
    };
    if (!preventCache) {
        cache_1.default.putImageLoadObject(derivedImageId, imageLoadObject);
    }
    return imageLoadObject.promise;
}
exports.createAndCacheDerivedImage = createAndCacheDerivedImage;
function createAndCacheDerivedImages(referencedImageIds, options = {}) {
    if ((referencedImageIds === null || referencedImageIds === void 0 ? void 0 : referencedImageIds.length) === 0) {
        throw new Error('createAndCacheDerivedImages: parameter imageIds must be list of image Ids');
    }
    const derivedImageIds = [];
    const allPromises = referencedImageIds.map((referencedImageId) => {
        var _a;
        const newOptions = Object.assign({ imageId: ((_a = options.getDerivedImageId) === null || _a === void 0 ? void 0 : _a.call(options, referencedImageId)) || `derived:${(0, utilities_1.uuidv4)()}` }, options);
        derivedImageIds.push(newOptions.imageId);
        return createAndCacheDerivedImage(referencedImageId, newOptions);
    });
    return { imageIds: derivedImageIds, promises: allPromises };
}
exports.createAndCacheDerivedImages = createAndCacheDerivedImages;
function createAndCacheLocalImage(options, imageId, preventCache = false) {
    var _a;
    const imagePlaneModule = __1.metaData.get('imagePlaneModule', imageId);
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
        const { numBytes, TypedArrayConstructor } = (0, utilities_1.getBufferConfiguration)(options.targetBufferType, length);
        const imageScalarData = new TypedArrayConstructor(length);
        image.sizeInBytes = numBytes;
        image.getPixelData = () => imageScalarData;
    }
    (_a = options.onCacheAdd) === null || _a === void 0 ? void 0 : _a.call(options, image);
    const imageLoadObject = {
        promise: Promise.resolve(image),
    };
    if (!preventCache) {
        cache_1.default.putImageLoadObject(image.imageId, imageLoadObject);
    }
    return image;
}
exports.createAndCacheLocalImage = createAndCacheLocalImage;
function cancelLoadImage(imageId) {
    const filterFunction = ({ additionalDetails }) => {
        if (additionalDetails.imageId) {
            return additionalDetails.imageId !== imageId;
        }
        return true;
    };
    imageLoadPoolManager_1.default.filterRequests(filterFunction);
    const imageLoadObject = cache_1.default.getImageLoadObject(imageId);
    if (imageLoadObject) {
        imageLoadObject.cancelFn();
    }
}
exports.cancelLoadImage = cancelLoadImage;
function cancelLoadImages(imageIds) {
    imageIds.forEach((imageId) => cancelLoadImage(imageId));
}
exports.cancelLoadImages = cancelLoadImages;
function cancelLoadAll() {
    const requestPool = imageLoadPoolManager_1.default.getRequestPool();
    Object.keys(requestPool).forEach((type) => {
        const requests = requestPool[type];
        Object.keys(requests).forEach((priority) => {
            const requestDetails = requests[priority].pop();
            const additionalDetails = requestDetails.additionalDetails;
            const { imageId, volumeId } = additionalDetails;
            let loadObject;
            if (imageId) {
                loadObject = cache_1.default.getImageLoadObject(imageId);
            }
            else if (volumeId) {
                loadObject = cache_1.default.getVolumeLoadObject(volumeId);
            }
            if (loadObject) {
                loadObject.cancel();
            }
        });
        imageLoadPoolManager_1.default.clearRequestStack(type);
    });
}
exports.cancelLoadAll = cancelLoadAll;
function registerImageLoader(scheme, imageLoader) {
    imageLoaders[scheme] = imageLoader;
}
exports.registerImageLoader = registerImageLoader;
function registerUnknownImageLoader(imageLoader) {
    const oldImageLoader = unknownImageLoader;
    unknownImageLoader = imageLoader;
    return oldImageLoader;
}
exports.registerUnknownImageLoader = registerUnknownImageLoader;
function unregisterAllImageLoaders() {
    Object.keys(imageLoaders).forEach((imageLoader) => delete imageLoaders[imageLoader]);
    unknownImageLoader = undefined;
}
exports.unregisterAllImageLoaders = unregisterAllImageLoaders;
function createAndCacheDerivedSegmentationImages(referencedImageIds, options = {
    targetBufferType: 'Uint8Array',
}) {
    return createAndCacheDerivedImages(referencedImageIds, options);
}
exports.createAndCacheDerivedSegmentationImages = createAndCacheDerivedSegmentationImages;
function createAndCacheDerivedSegmentationImage(referencedImageId, options = {
    targetBufferType: 'Uint8Array',
}) {
    return createAndCacheDerivedImage(referencedImageId, options);
}
exports.createAndCacheDerivedSegmentationImage = createAndCacheDerivedSegmentationImage;
//# sourceMappingURL=imageLoader.js.map