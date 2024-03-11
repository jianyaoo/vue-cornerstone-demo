"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performCacheOptimizationForVolume = exports.setupCacheOptimizationEventListener = void 0;
const cache_1 = __importStar(require("../cache"));
const enums_1 = require("../enums");
const eventTarget_1 = __importDefault(require("../eventTarget"));
const init_1 = require("../init");
function setupCacheOptimizationEventListener(volumeId) {
    const { enableCacheOptimization } = (0, init_1.getConfiguration)();
    const shouldUseSAB = (0, init_1.getShouldUseSharedArrayBuffer)();
    const performOptimization = enableCacheOptimization && shouldUseSAB;
    if (!performOptimization) {
        return;
    }
    eventTarget_1.default.addEventListenerOnce(enums_1.Events.IMAGE_VOLUME_LOADING_COMPLETED, (evt) => {
        if (evt.detail.volumeId !== volumeId) {
            return;
        }
        const volume = cache_1.default.getVolume(volumeId);
        performCacheOptimizationForVolume(volume);
    });
}
exports.setupCacheOptimizationEventListener = setupCacheOptimizationEventListener;
function performCacheOptimizationForVolume(volume) {
    if (!(volume instanceof cache_1.ImageVolume)) {
        return;
    }
    const scalarData = volume.getScalarData();
    volume.imageCacheOffsetMap.size > 0
        ? _processImageCacheOffsetMap(volume, scalarData)
        : _processVolumeImages(volume, scalarData);
}
exports.performCacheOptimizationForVolume = performCacheOptimizationForVolume;
function _processImageCacheOffsetMap(volume, scalarData) {
    volume.imageCacheOffsetMap.forEach(({ offset }, imageId) => {
        const image = cache_1.default.getImage(imageId);
        if (!image) {
            return;
        }
        _updateImageWithScalarDataView(image, scalarData, offset);
        cache_1.default.decrementImageCacheSize(image.sizeInBytes);
    });
}
function _processVolumeImages(volume, scalarData) {
    var _a;
    let compatibleScalarData = scalarData;
    const sampleImageIdWithImage = volume.imageIds.find((imageId) => {
        const image = cache_1.default.getImage(imageId);
        return image;
    });
    if (!sampleImageIdWithImage) {
        return;
    }
    const sampleImage = cache_1.default.getImage(sampleImageIdWithImage);
    const samplePixelData = ((_a = sampleImage.imageFrame) === null || _a === void 0 ? void 0 : _a.pixelData) || sampleImage.getPixelData();
    if (scalarData.constructor !== samplePixelData.constructor) {
        compatibleScalarData = new samplePixelData.constructor(scalarData.length);
        compatibleScalarData.set(scalarData);
    }
    volume.imageIds.forEach((imageId) => {
        const image = cache_1.default.getImage(imageId);
        if (!image) {
            return;
        }
        const index = volume.getImageIdIndex(imageId);
        const offset = index * image.getPixelData().byteLength;
        _updateImageWithScalarDataView(image, compatibleScalarData, offset);
        cache_1.default.decrementImageCacheSize(image.sizeInBytes);
    });
}
function _updateImageWithScalarDataView(image, scalarData, offset) {
    const pixelData = image.imageFrame
        ? image.imageFrame.pixelData
        : image.getPixelData();
    const view = new pixelData.constructor(scalarData.buffer, offset, pixelData.length);
    image.getPixelData = () => view;
    if (image.imageFrame) {
        image.imageFrame.pixelData = view;
    }
    image.bufferView = {
        buffer: scalarData.buffer,
        offset,
    };
}
//# sourceMappingURL=cacheUtils.js.map