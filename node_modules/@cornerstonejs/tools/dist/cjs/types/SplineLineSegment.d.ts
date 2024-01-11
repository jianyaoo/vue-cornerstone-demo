import { Types } from '@cornerstonejs/core';
export declare type SplineLineSegment = {
    points: {
        start: Types.Point2;
        end: Types.Point2;
    };
    aabb: Types.AABB2;
    length: number;
    previousLineSegmentsLength: number;
};
