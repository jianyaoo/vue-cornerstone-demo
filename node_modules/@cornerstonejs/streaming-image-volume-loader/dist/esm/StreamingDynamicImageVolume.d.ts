import { type Types } from '@cornerstonejs/core';
import BaseStreamingImageVolume from './BaseStreamingImageVolume';
export default class StreamingDynamicImageVolume extends BaseStreamingImageVolume implements Types.IDynamicImageVolume {
    private _numTimePoints;
    private _timePoints;
    private _timePointIndex;
    private _splittingTag;
    constructor(imageVolumeProperties: Types.ImageVolumeProps & {
        splittingTag: string;
    }, streamingProperties: Types.IStreamingVolumeProperties);
    private static _ensureValidData;
    private _getTimePointsData;
    private _getTimePointsToLoad;
    private _getTimePointRequests;
    private _getTimePointsRequests;
    getImageIdsToLoad(): string[];
    isDynamicVolume(): boolean;
    get timePointIndex(): number;
    set timePointIndex(newTimePointIndex: number);
    get splittingTag(): string;
    get numTimePoints(): number;
    getScalarData(): Types.PixelDataTypedArray;
    getImageLoadRequests: (priority: number) => any[];
}
