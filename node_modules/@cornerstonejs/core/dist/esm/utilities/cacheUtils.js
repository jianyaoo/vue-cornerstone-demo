import cache, { ImageVolume } from '../cache';
import { Events } from '../enums';
import eventTarget from '../eventTarget';
import { getConfiguration, getShouldUseSharedArrayBuffer } from '../init';
export function setupCacheOptimizationEventListener(volumeId) {
    const { enableCacheOptimization } = getConfiguration();
    const shouldUseSAB = getShouldUseSharedArrayBuffer();
    const performOptimization = enableCacheOptimization && shouldUseSAB;
    if (!performOptimization) {
        return;
    }
    eventTarget.addEventListenerOnce(Events.IMAGE_VOLUME_LOADING_COMPLETED, (evt) => {
        if (evt.detail.volumeId !== volumeId) {
            return;
        }
        const volume = cache.getVolume(volumeId);
        performCacheOptimizationForVolume(volume);
    });
}
export function performCacheOptimizationForVolume(volume) {
    if (!(volume instanceof ImageVolume)) {
        return;
    }
    const scalarData = volume.getScalarData();
    volume.imageCacheOffsetMap.size > 0
        ? _processImageCacheOffsetMap(volume, scalarData)
        : _processVolumeImages(volume, scalarData);
}
function _processImageCacheOffsetMap(volume, scalarData) {
    volume.imageCacheOffsetMap.forEach(({ offset }, imageId) => {
        const image = cache.getImage(imageId);
        if (!image) {
            return;
        }
        _updateImageWithScalarDataView(image, scalarData, offset);
        cache.decrementImageCacheSize(image.sizeInBytes);
    });
}
function _processVolumeImages(volume, scalarData) {
    let compatibleScalarData = scalarData;
    const sampleImageIdWithImage = volume.imageIds.find((imageId) => {
        const image = cache.getImage(imageId);
        return image;
    });
    if (!sampleImageIdWithImage) {
        return;
    }
    const sampleImage = cache.getImage(sampleImageIdWithImage);
    const samplePixelData = sampleImage.imageFrame?.pixelData || sampleImage.getPixelData();
    if (scalarData.constructor !== samplePixelData.constructor) {
        compatibleScalarData = new samplePixelData.constructor(scalarData.length);
        compatibleScalarData.set(scalarData);
    }
    volume.imageIds.forEach((imageId) => {
        const image = cache.getImage(imageId);
        if (!image) {
            return;
        }
        const index = volume.getImageIdIndex(imageId);
        const offset = index * image.getPixelData().byteLength;
        _updateImageWithScalarDataView(image, compatibleScalarData, offset);
        cache.decrementImageCacheSize(image.sizeInBytes);
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