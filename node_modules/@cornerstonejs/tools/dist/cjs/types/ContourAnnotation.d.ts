import type { Types } from '@cornerstonejs/core';
import { Annotation } from './AnnotationTypes';
export declare enum ContourWindingDirection {
    CounterClockwise = -1,
    Unknown = 0,
    Clockwise = 1
}
export declare type ContourAnnotationData = {
    data: {
        contour: {
            polyline: Types.Point3[];
            closed: boolean;
            windingDirection?: ContourWindingDirection;
        };
    };
    onInterpolationComplete?: () => void;
};
export declare type ContourAnnotation = Annotation & ContourAnnotationData;
