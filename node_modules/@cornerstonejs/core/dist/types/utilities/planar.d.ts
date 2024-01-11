import { Point3, Plane } from '../types';
import { vec3 } from 'gl-matrix';
declare function linePlaneIntersection(p0: Point3, p1: Point3, plane: Plane): Point3;
declare function planeEquation(normal: Point3, point: Point3 | vec3, normalized?: boolean): Plane;
declare function threePlaneIntersection(firstPlane: Plane, secondPlane: Plane, thirdPlane: Plane): Point3;
declare function planeDistanceToPoint(plane: Plane, point: Point3, signed?: boolean): number;
export { linePlaneIntersection, planeEquation, threePlaneIntersection, planeDistanceToPoint, };
//# sourceMappingURL=planar.d.ts.map