import type { Types } from '@cornerstonejs/core';
import { ThresholdInformation } from './utilities';
export declare type ThresholdOptions = {
    numSlicesToProject?: number;
    overwrite: boolean;
    overlapType?: number;
};
export declare type AnnotationForThresholding = {
    data: {
        handles: {
            points: Types.Point3[];
        };
        cachedStats?: {
            projectionPoints?: Types.Point3[][];
        };
    };
};
declare function rectangleROIThresholdVolumeByRange(annotationUIDs: string[], segmentationVolume: Types.IImageVolume, thresholdVolumeInformation: ThresholdInformation[], options: ThresholdOptions): Types.IImageVolume;
export default rectangleROIThresholdVolumeByRange;
