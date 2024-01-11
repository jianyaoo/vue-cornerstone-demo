import type { Types } from '@cornerstonejs/core';
declare type ellipsoid = {
    center: [number, number, number];
    width: number;
    height: number;
    depth: number;
};
export default function pointInEllipsoidWithConstraint(ellipsoid: ellipsoid, point: Types.Point3, viewPlane: Types.Point3): void;
export {};
