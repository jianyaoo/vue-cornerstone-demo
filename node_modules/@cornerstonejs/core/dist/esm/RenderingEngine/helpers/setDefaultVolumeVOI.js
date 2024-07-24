import { loadAndCacheImage } from '../../loaders/imageLoader';
import * as metaData from '../../metaData';
import { getMinMax, windowLevel } from '../../utilities';
import { RequestType } from '../../enums';
import cache from '../../cache';
const PRIORITY = 0;
const REQUEST_TYPE = RequestType.Prefetch;
async function setDefaultVolumeVOI(volumeActor, imageVolume, useNativeDataType) {
    let voi = getVOIFromMetadata(imageVolume);
    if (!voi && imageVolume?.imageIds?.length) {
        voi = await getVOIFromMinMax(imageVolume, useNativeDataType);
        voi = handlePreScaledVolume(imageVolume, voi);
    }
    if ((voi?.lower === 0 && voi?.upper === 0) ||
        voi?.lower === undefined ||
        voi?.upper === undefined) {
        return;
    }
    volumeActor
        .getProperty()
        .getRGBTransferFunction(0)
        .setMappingRange(voi.lower, voi.upper);
}
function handlePreScaledVolume(imageVolume, voi) {
    const imageIds = imageVolume.imageIds;
    const imageIdIndex = Math.floor(imageIds.length / 2);
    const imageId = imageIds[imageIdIndex];
    const generalSeriesModule = metaData.get('generalSeriesModule', imageId) || {};
    if (_isCurrentImagePTPrescaled(generalSeriesModule.modality, imageVolume)) {
        return {
            lower: 0,
            upper: 5,
        };
    }
    return voi;
}
function getVOIFromMetadata(imageVolume) {
    const { imageIds, metadata } = imageVolume;
    let voi;
    if (imageIds.length) {
        const imageIdIndex = Math.floor(imageIds.length / 2);
        const imageId = imageIds[imageIdIndex];
        const voiLutModule = metaData.get('voiLutModule', imageId);
        if (voiLutModule && voiLutModule.windowWidth && voiLutModule.windowCenter) {
            const { windowWidth, windowCenter } = voiLutModule;
            voi = {
                windowWidth: Array.isArray(windowWidth) ? windowWidth[0] : windowWidth,
                windowCenter: Array.isArray(windowCenter)
                    ? windowCenter[0]
                    : windowCenter,
            };
        }
    }
    else {
        voi = metadata?.voiLut?.[0];
    }
    if (voi) {
        const { lower, upper } = windowLevel.toLowHighRange(Number(voi.windowWidth), Number(voi.windowCenter));
        return {
            lower,
            upper,
        };
    }
}
async function getVOIFromMinMax(imageVolume, useNativeDataType) {
    const { imageIds } = imageVolume;
    const scalarData = imageVolume.getScalarData();
    const imageIdIndex = Math.floor(imageIds.length / 2);
    const imageId = imageVolume.imageIds[imageIdIndex];
    const generalSeriesModule = metaData.get('generalSeriesModule', imageId) || {};
    const { modality } = generalSeriesModule;
    const modalityLutModule = metaData.get('modalityLutModule', imageId) || {};
    const numImages = imageIds.length;
    const bytesPerImage = scalarData.byteLength / numImages;
    const voxelsPerImage = scalarData.length / numImages;
    const bytePerPixel = scalarData.BYTES_PER_ELEMENT;
    const scalingParameters = {
        rescaleSlope: modalityLutModule.rescaleSlope,
        rescaleIntercept: modalityLutModule.rescaleIntercept,
        modality,
    };
    let scalingParametersToUse;
    if (modality === 'PT') {
        const suvFactor = metaData.get('scalingModule', imageId);
        if (suvFactor) {
            scalingParametersToUse = {
                ...scalingParameters,
                suvbw: suvFactor.suvbw,
            };
        }
    }
    const byteOffset = imageIdIndex * bytesPerImage;
    const options = {
        targetBuffer: {
            type: useNativeDataType ? undefined : 'Float32Array',
        },
        priority: PRIORITY,
        requestType: REQUEST_TYPE,
        useNativeDataType,
        preScale: {
            enabled: true,
            scalingParameters: scalingParametersToUse,
        },
    };
    let image = cache.getImage(imageId);
    if (!imageVolume.referencedImageIds?.length) {
        image = await loadAndCacheImage(imageId, { ...options, ignoreCache: true });
    }
    const imageScalarData = image
        ? image.getPixelData()
        : _getImageScalarDataFromImageVolume(imageVolume, byteOffset, bytePerPixel, voxelsPerImage);
    const { min, max } = getMinMax(imageScalarData);
    return {
        lower: min,
        upper: max,
    };
}
function _getImageScalarDataFromImageVolume(imageVolume, byteOffset, bytePerPixel, voxelsPerImage) {
    const { scalarData } = imageVolume;
    const { buffer } = scalarData;
    if (scalarData.BYTES_PER_ELEMENT !== bytePerPixel) {
        byteOffset *= scalarData.BYTES_PER_ELEMENT / bytePerPixel;
    }
    const TypedArray = scalarData.constructor;
    const imageScalarData = new TypedArray(voxelsPerImage);
    const volumeBufferView = new TypedArray(buffer, byteOffset, voxelsPerImage);
    imageScalarData.set(volumeBufferView);
    return imageScalarData;
}
function _isCurrentImagePTPrescaled(modality, imageVolume) {
    if (modality !== 'PT' || !imageVolume.isPreScaled) {
        return false;
    }
    if (!imageVolume.scaling?.PT.suvbw) {
        return false;
    }
    return true;
}
export default setDefaultVolumeVOI;
//# sourceMappingURL=setDefaultVolumeVOI.js.map