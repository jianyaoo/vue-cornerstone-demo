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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageLoader_1 = require("../../loaders/imageLoader");
const metaData = __importStar(require("../../metaData"));
const utilities_1 = require("../../utilities");
const enums_1 = require("../../enums");
const PRIORITY = 0;
const REQUEST_TYPE = enums_1.RequestType.Prefetch;
function setDefaultVolumeVOI(volumeActor, imageVolume, useNativeDataType) {
    return __awaiter(this, void 0, void 0, function* () {
        let voi = getVOIFromMetadata(imageVolume);
        if (!voi) {
            voi = yield getVOIFromMinMax(imageVolume, useNativeDataType);
        }
        if (!voi || voi.lower === undefined || voi.upper === undefined) {
            throw new Error('Could not get VOI from metadata, nor from the min max of the image middle slice');
        }
        voi = handlePreScaledVolume(imageVolume, voi);
        const { lower, upper } = voi;
        volumeActor
            .getProperty()
            .getRGBTransferFunction(0)
            .setMappingRange(lower, upper);
    });
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
    const { imageIds } = imageVolume;
    const imageIdIndex = Math.floor(imageIds.length / 2);
    const imageId = imageIds[imageIdIndex];
    const voiLutModule = metaData.get('voiLutModule', imageId);
    if (voiLutModule && voiLutModule.windowWidth && voiLutModule.windowCenter) {
        const { windowWidth, windowCenter } = voiLutModule;
        const voi = {
            windowWidth: Array.isArray(windowWidth) ? windowWidth[0] : windowWidth,
            windowCenter: Array.isArray(windowCenter)
                ? windowCenter[0]
                : windowCenter,
        };
        const { lower, upper } = utilities_1.windowLevel.toLowHighRange(Number(voi.windowWidth), Number(voi.windowCenter));
        return {
            lower,
            upper,
        };
    }
}
function getVOIFromMinMax(imageVolume, useNativeDataType) {
    return __awaiter(this, void 0, void 0, function* () {
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
                scalingParametersToUse = Object.assign(Object.assign({}, scalingParameters), { suvbw: suvFactor.suvbw });
            }
        }
        const byteOffset = imageIdIndex * bytesPerImage;
        const options = {
            targetBuffer: {
                type: useNativeDataType ? undefined : 'Float32Array',
            },
            priority: PRIORITY,
            requestType: REQUEST_TYPE,
            preScale: {
                enabled: true,
                scalingParameters: scalingParametersToUse,
            },
        };
        const image = yield (0, imageLoader_1.loadAndCacheImage)(imageId, options);
        let imageScalarData;
        if (!image) {
            imageScalarData = _getImageScalarDataFromImageVolume(imageVolume, byteOffset, bytePerPixel, voxelsPerImage);
        }
        else {
            imageScalarData = image.getPixelData();
        }
        const { min, max } = (0, utilities_1.getMinMax)(imageScalarData);
        return {
            lower: min,
            upper: max,
        };
    });
}
function _getImageScalarDataFromImageVolume(imageVolume, byteOffset, bytePerPixel, voxelsPerImage) {
    const { scalarData } = imageVolume;
    const { volumeBuffer } = scalarData;
    if (scalarData.BYTES_PER_ELEMENT !== bytePerPixel) {
        byteOffset *= scalarData.BYTES_PER_ELEMENT / bytePerPixel;
    }
    const TypedArray = scalarData.constructor;
    const imageScalarData = new TypedArray(voxelsPerImage);
    const volumeBufferView = new TypedArray(volumeBuffer, byteOffset, voxelsPerImage);
    imageScalarData.set(volumeBufferView);
    return imageScalarData;
}
function _isCurrentImagePTPrescaled(modality, imageVolume) {
    var _a;
    if (modality !== 'PT' || !imageVolume.isPreScaled) {
        return false;
    }
    if (!((_a = imageVolume.scaling) === null || _a === void 0 ? void 0 : _a.PT.suvbw)) {
        return false;
    }
    return true;
}
exports.default = setDefaultVolumeVOI;
//# sourceMappingURL=setDefaultVolumeVOI.js.map