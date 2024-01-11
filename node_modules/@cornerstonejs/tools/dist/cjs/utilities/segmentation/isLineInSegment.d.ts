import type { Types } from '@cornerstonejs/core';
import { vec3 } from 'gl-matrix';
export default function isLineInSegment(point1: Types.Point3, point2: Types.Point3, isInSegment: any): boolean;
declare function createIsInSegment(segVolumeId: string, segmentIndex: number, containedSegmentIndices?: Set<number>): {
    testCenter: (point1: any, point2: any) => boolean;
    toIJK: (point: any) => vec3;
    testIJK: (ijk: any) => boolean;
};
export { createIsInSegment, isLineInSegment };
