import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import isTypedArray from '../../utilities/isTypedArray';
import { genericMetadataProvider, getMinMax, imageIdToURI, } from '../../utilities';
import { vtkStreamingOpenGLTexture } from '../../RenderingEngine/vtkClasses';
import cache from '../cache';
import * as metaData from '../../metaData';
export class ImageVolume {
    constructor(props) {
        this._imageIdsIndexMap = new Map();
        this._imageURIsIndexMap = new Map();
        this.cornerstoneImageMetaData = null;
        this.imageCacheOffsetMap = new Map();
        this.isPreScaled = false;
        const { imageIds, scalarData, scaling, dimensions, spacing, origin, direction, volumeId, referencedVolumeId, sizeInBytes, imageData, metadata, referencedImageIds, additionalDetails, } = props;
        this.imageIds = imageIds;
        this.volumeId = volumeId;
        this.metadata = metadata;
        this.dimensions = dimensions;
        this.spacing = spacing;
        this.origin = origin;
        this.direction = direction;
        this.scalarData = scalarData;
        this.sizeInBytes = sizeInBytes;
        this.vtkOpenGLTexture = vtkStreamingOpenGLTexture.newInstance();
        this.numVoxels =
            this.dimensions[0] * this.dimensions[1] * this.dimensions[2];
        if (imageData) {
            this.imageData = imageData;
        }
        else {
            const imageData = vtkImageData.newInstance();
            const scalarArray = vtkDataArray.newInstance({
                name: 'Pixels',
                numberOfComponents: 1,
                values: scalarData,
            });
            imageData.setDimensions(dimensions);
            imageData.setSpacing(spacing);
            imageData.setDirection(direction);
            imageData.setOrigin(origin);
            imageData.getPointData().setScalars(scalarArray);
            this.imageData = imageData;
        }
        this.numFrames = this._getNumFrames();
        this._reprocessImageIds();
        this._createCornerstoneImageMetaData();
        if (scaling) {
            this.scaling = scaling;
        }
        if (referencedVolumeId) {
            this.referencedVolumeId = referencedVolumeId;
        }
        if (referencedImageIds) {
            this.referencedImageIds = referencedImageIds;
        }
        if (additionalDetails) {
            this.additionalDetails = additionalDetails;
        }
    }
    get imageIds() {
        return this._imageIds;
    }
    set imageIds(newImageIds) {
        this._imageIds = newImageIds;
        this._reprocessImageIds();
    }
    _reprocessImageIds() {
        this._imageIdsIndexMap.clear();
        this._imageURIsIndexMap.clear();
        this._imageIds.forEach((imageId, i) => {
            const imageURI = imageIdToURI(imageId);
            this._imageIdsIndexMap.set(imageId, i);
            this._imageURIsIndexMap.set(imageURI, i);
        });
    }
    isDynamicVolume() {
        return false;
    }
    getScalarData() {
        if (isTypedArray(this.scalarData)) {
            return this.scalarData;
        }
        throw new Error('Unknown scalar data type');
    }
    getImageIdIndex(imageId) {
        return this._imageIdsIndexMap.get(imageId);
    }
    getImageURIIndex(imageURI) {
        return this._imageURIsIndexMap.get(imageURI);
    }
    destroy() {
        this.imageData.delete();
        this.imageData = null;
        this.scalarData = null;
        this.vtkOpenGLTexture.releaseGraphicsResources();
        this.vtkOpenGLTexture.delete();
    }
    getScalarDataArrays() {
        return this.isDynamicVolume()
            ? this.scalarData
            : [this.scalarData];
    }
    modified() {
        this.imageData.modified();
        if (this.isDynamicVolume()) {
            throw new Error('Not implemented');
        }
        else {
            this.scalarData = this.imageData
                .getPointData()
                .getScalars()
                .getData();
        }
        this.numFrames = this._getNumFrames();
    }
    decache(completelyRemove = false) {
        if (completelyRemove) {
            this.removeFromCache();
        }
        else {
            this.convertToImageSlicesAndCache();
        }
    }
    removeFromCache() {
        cache.removeVolumeLoadObject(this.volumeId);
    }
    getScalarDataLength() {
        const { scalarData } = this;
        return this.isDynamicVolume()
            ? scalarData[0].length
            : scalarData.length;
    }
    _getNumFrames() {
        const { imageIds, scalarData } = this;
        const scalarDataCount = this.isDynamicVolume() ? scalarData.length : 1;
        return imageIds.length / scalarDataCount;
    }
    _getScalarDataLength() {
        const { scalarData } = this;
        return this.isDynamicVolume()
            ? scalarData[0].length
            : scalarData.length;
    }
    _createCornerstoneImageMetaData() {
        const { numFrames } = this;
        if (numFrames === 0) {
            return;
        }
        const bytesPerImage = this.sizeInBytes / numFrames;
        const scalarDataLength = this._getScalarDataLength();
        const numComponents = scalarDataLength / this.numVoxels;
        const pixelsPerImage = this.dimensions[0] * this.dimensions[1] * numComponents;
        const { PhotometricInterpretation, voiLut, VOILUTFunction } = this.metadata;
        let windowCenter = [];
        let windowWidth = [];
        if (voiLut && voiLut.length) {
            windowCenter = voiLut.map((voi) => {
                return voi.windowCenter;
            });
            windowWidth = voiLut.map((voi) => {
                return voi.windowWidth;
            });
        }
        const color = numComponents > 1 ? true : false;
        this.cornerstoneImageMetaData = {
            bytesPerImage,
            numComponents,
            pixelsPerImage,
            windowCenter,
            windowWidth,
            color,
            rgba: false,
            spacing: this.spacing,
            dimensions: this.dimensions,
            photometricInterpretation: PhotometricInterpretation,
            voiLUTFunction: VOILUTFunction,
            invert: PhotometricInterpretation === 'MONOCHROME1',
        };
    }
    getScalarDataByImageIdIndex(imageIdIndex) {
        if (imageIdIndex < 0 || imageIdIndex >= this.imageIds.length) {
            throw new Error('imageIdIndex out of range');
        }
        const scalarDataArrays = this.getScalarDataArrays();
        const scalarDataIndex = Math.floor(imageIdIndex / this.numFrames);
        return scalarDataArrays[scalarDataIndex];
    }
    getCornerstoneImage(imageId, imageIdIndex) {
        const { imageIds } = this;
        const frameIndex = this.imageIdIndexToFrameIndex(imageIdIndex);
        const { bytesPerImage, pixelsPerImage, windowCenter, windowWidth, numComponents, color, dimensions, spacing, invert, voiLUTFunction, photometricInterpretation, } = this.cornerstoneImageMetaData;
        const scalarData = this.getScalarDataByImageIdIndex(imageIdIndex);
        const volumeBuffer = scalarData.buffer;
        const TypedArray = scalarData.constructor;
        const bytePerPixel = bytesPerImage / pixelsPerImage;
        let byteOffset = bytesPerImage * frameIndex;
        if (scalarData.BYTES_PER_ELEMENT !== bytePerPixel) {
            byteOffset *= scalarData.BYTES_PER_ELEMENT / bytePerPixel;
        }
        const imageScalarData = new TypedArray(pixelsPerImage);
        const volumeBufferView = new TypedArray(volumeBuffer, byteOffset, pixelsPerImage);
        imageScalarData.set(volumeBufferView);
        const volumeImageId = imageIds[imageIdIndex];
        const modalityLutModule = metaData.get('modalityLutModule', volumeImageId) || {};
        const minMax = getMinMax(imageScalarData);
        const intercept = modalityLutModule.rescaleIntercept
            ? modalityLutModule.rescaleIntercept
            : 0;
        return {
            imageId,
            intercept,
            windowCenter,
            windowWidth,
            voiLUTFunction,
            color,
            rgba: false,
            numComps: numComponents,
            rows: dimensions[1],
            columns: dimensions[0],
            sizeInBytes: imageScalarData.byteLength,
            getPixelData: () => imageScalarData,
            minPixelValue: minMax.min,
            maxPixelValue: minMax.max,
            slope: modalityLutModule.rescaleSlope
                ? modalityLutModule.rescaleSlope
                : 1,
            getCanvas: undefined,
            height: dimensions[0],
            width: dimensions[1],
            columnPixelSpacing: spacing[0],
            rowPixelSpacing: spacing[1],
            invert,
            photometricInterpretation,
        };
    }
    imageIdIndexToFrameIndex(imageIdIndex) {
        return imageIdIndex % this.numFrames;
    }
    convertToCornerstoneImage(imageId, imageIdIndex) {
        return this.getCornerstoneImageLoadObject(imageId, imageIdIndex);
    }
    getCornerstoneImageLoadObject(imageId, imageIdIndex) {
        const image = this.getCornerstoneImage(imageId, imageIdIndex);
        const imageLoadObject = {
            promise: Promise.resolve(image),
        };
        return imageLoadObject;
    }
    getCornerstoneImages() {
        const { imageIds } = this;
        return imageIds.map((imageId, imageIdIndex) => {
            return this.getCornerstoneImage(imageId, imageIdIndex);
        });
    }
    convertToImageSlicesAndCache() {
        const byteLength = this.sizeInBytes;
        if (!this.imageIds?.length) {
            const referencedVolumeId = this.referencedVolumeId;
            let numSlices = this.dimensions[2];
            if (referencedVolumeId) {
                const referencedVolume = cache.getVolume(referencedVolumeId);
                numSlices = referencedVolume?.imageIds?.length ?? numSlices;
            }
            this.imageIds = Array.from({ length: numSlices }, (_, i) => {
                return `generated:${this.volumeId}:${i}`;
            });
            this._reprocessImageIds();
            this.numFrames = this._getNumFrames();
            this._createCornerstoneImageMetaData();
        }
        const numImages = this.imageIds.length;
        const { bytesPerImage } = this.cornerstoneImageMetaData;
        let bytesRemaining = cache.decacheIfNecessaryUntilBytesAvailable(byteLength, this.imageIds);
        for (let imageIdIndex = 0; imageIdIndex < numImages; imageIdIndex++) {
            const imageId = this.imageIds[imageIdIndex];
            bytesRemaining = bytesRemaining - bytesPerImage;
            const image = this.getCornerstoneImage(imageId, imageIdIndex);
            const imageLoadObject = {
                promise: Promise.resolve(image),
            };
            if (!cache.getImageLoadObject(imageId)) {
                cache.putImageLoadObject(imageId, imageLoadObject).catch((err) => {
                    console.error(err);
                });
            }
            if (bytesRemaining <= bytesPerImage) {
                break;
            }
            const imageOrientationPatient = [
                this.direction[0],
                this.direction[1],
                this.direction[2],
                this.direction[3],
                this.direction[4],
                this.direction[5],
            ];
            const precision = 6;
            const imagePositionPatient = [
                parseFloat((this.origin[0] +
                    imageIdIndex * this.direction[6] * this.spacing[0]).toFixed(precision)),
                parseFloat((this.origin[1] +
                    imageIdIndex * this.direction[7] * this.spacing[1]).toFixed(precision)),
                parseFloat((this.origin[2] +
                    imageIdIndex * this.direction[8] * this.spacing[2]).toFixed(precision)),
            ];
            const pixelData = image.getPixelData();
            const bitsAllocated = pixelData.BYTES_PER_ELEMENT * 8;
            const imagePixelModule = {
                bitsAllocated,
                photometricInterpretation: image.photometricInterpretation,
                windowWidth: image.windowWidth,
                windowCenter: image.windowCenter,
                voiLUTFunction: image.voiLUTFunction,
            };
            const imagePlaneModule = {
                rowCosines: [this.direction[0], this.direction[1], this.direction[2]],
                columnCosines: [
                    this.direction[3],
                    this.direction[4],
                    this.direction[5],
                ],
                pixelSpacing: [this.spacing[0], this.spacing[1]],
                imageOrientationPatient: imageOrientationPatient,
                imagePositionPatient: imagePositionPatient,
                columnPixelSpacing: image.columnPixelSpacing,
                rowPixelSpacing: image.rowPixelSpacing,
                columns: image.columns,
                rows: image.rows,
            };
            const generalSeriesModule = {};
            const metadata = {
                imagePixelModule,
                imagePlaneModule,
                generalSeriesModule,
            };
            ['imagePixelModule', 'imagePlaneModule', 'generalSeriesModule'].forEach((type) => {
                genericMetadataProvider.add(imageId, {
                    type,
                    metadata: metadata[type],
                });
            });
        }
        const otherVolumes = cache.filterVolumesByReferenceId(this.volumeId);
        if (otherVolumes.length) {
            otherVolumes.forEach((volume) => {
                volume.referencedImageIds = this.imageIds;
            });
        }
        this.removeFromCache();
        return this.imageIds;
    }
}
export default ImageVolume;
//# sourceMappingURL=ImageVolume.js.map