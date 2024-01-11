import type { Types } from '@cornerstonejs/core';
import { vec3 } from 'gl-matrix';
declare type Sphere = {
    center: Types.Point3 | vec3;
    radius: number;
    radius2?: number;
};
export default function pointInSphere(sphere: Sphere, pointLPS: vec3): boolean;
export {};
