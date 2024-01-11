import type { Types } from '@cornerstonejs/core';
declare function getVolumeInfo(imageIds: string[]): {
    metadata: Types.Metadata;
    sortedImageIds: string[];
    dimensions: Types.Point3;
    spacing: Types.Point3;
    origin: Types.Point3;
    direction: Types.Mat3;
    scalarData: any;
    sizeInBytes: number;
};
export { getVolumeInfo, getVolumeInfo as default };
