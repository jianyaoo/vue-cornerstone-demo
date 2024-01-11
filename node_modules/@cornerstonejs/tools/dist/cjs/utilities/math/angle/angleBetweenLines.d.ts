import type { Types } from '@cornerstonejs/core';
declare type Line2D = [Types.Point2, Types.Point2];
declare type Line3D = [Types.Point3, Types.Point3];
declare type Line = Line2D | Line3D;
export default function angleBetweenLines(line1: Line, line2: Line): number;
export {};
