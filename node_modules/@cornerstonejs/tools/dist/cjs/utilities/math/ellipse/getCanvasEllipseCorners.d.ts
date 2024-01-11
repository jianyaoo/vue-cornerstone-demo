import type { Types } from '@cornerstonejs/core';
export declare type CanvasCoordinates = [
    Types.Point2,
    Types.Point2,
    Types.Point2,
    Types.Point2
];
export default function getCanvasEllipseCorners(ellipseCanvasPoints: CanvasCoordinates): Array<Types.Point2>;
