import { Types } from '@cornerstonejs/core';
export declare type ThresholdInformation = {
    volume: Types.IImageVolume;
    lower: number;
    upper: number;
};
export declare function getBrushToolInstances(toolGroupId: string, toolName?: string): any[];
export declare function getVoxelOverlap(imageData: any, dimensions: any, voxelSpacing: any, voxelCenter: any): [Types.Point2, Types.Point2, null] | [Types.Point2, Types.Point2, Types.Point2];
export declare function processVolumes(segmentationVolume: Types.IImageVolume, thresholdVolumeInformation: ThresholdInformation[]): {
    volumeInfoList: any[];
    baseVolumeIdx: number;
};
