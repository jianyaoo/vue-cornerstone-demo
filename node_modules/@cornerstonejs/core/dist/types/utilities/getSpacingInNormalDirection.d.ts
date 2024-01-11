import { mat3 } from 'gl-matrix';
import { IImageVolume, Point3 } from '../types';
export default function getSpacingInNormalDirection(imageVolume: IImageVolume | {
    direction: mat3;
    spacing: Point3;
}, viewPlaneNormal: Point3): number;
//# sourceMappingURL=getSpacingInNormalDirection.d.ts.map