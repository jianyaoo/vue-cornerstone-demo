import { Types } from '@cornerstonejs/core';
import BaseStreamingImageVolume from './BaseStreamingImageVolume';
import ImageLoadRequests from './types/ImageLoadRequests';
export default class StreamingImageVolume extends BaseStreamingImageVolume {
    constructor(imageVolumeProperties: Types.ImageVolumeProps, streamingProperties: Types.IStreamingVolumeProperties);
    getScalarData(): Types.PixelDataTypedArray;
    getImageLoadRequests(priority: number): ImageLoadRequests[];
    getImageIdsToLoad: () => string[];
}
