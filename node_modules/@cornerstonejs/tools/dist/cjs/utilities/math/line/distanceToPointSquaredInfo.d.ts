import type { Types } from '@cornerstonejs/core';
export default function distanceToPointSquaredInfo(lineStart: Types.Point2, lineEnd: Types.Point2, point: Types.Point2): {
    point: Types.Point2;
    distanceSquared: number;
};
