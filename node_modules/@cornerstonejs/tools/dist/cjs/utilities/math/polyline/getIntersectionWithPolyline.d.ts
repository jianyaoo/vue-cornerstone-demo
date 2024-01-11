import type { Types } from '@cornerstonejs/core';
declare function getAllIntersectionsWithPolyline(points: Types.Point2[], p1: Types.Point2, q1: Types.Point2, closed?: boolean): Types.Point2[];
declare function getIntersectionCoordinatesWithPolyline(points: Types.Point2[], p1: Types.Point2, q1: Types.Point2, closed?: boolean): Types.Point2[];
declare function getFirstIntersectionWithPolyline(points: Types.Point2[], p1: Types.Point2, q1: Types.Point2, closed?: boolean): Types.Point2 | undefined;
declare function getClosestIntersectionWithPolyline(points: Types.Point2[], p1: Types.Point2, q1: Types.Point2, closed?: boolean): {
    segment: Types.Point2;
    distance: number;
} | undefined;
export { getAllIntersectionsWithPolyline, getFirstIntersectionWithPolyline, getClosestIntersectionWithPolyline, getIntersectionCoordinatesWithPolyline, };
