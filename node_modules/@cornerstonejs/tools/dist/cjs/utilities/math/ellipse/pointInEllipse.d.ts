import type { Types } from '@cornerstonejs/core';
interface Inverts {
    invXRadiusSq?: number;
    invYRadiusSq?: number;
    invZRadiusSq?: number;
    fast?: boolean;
    precalculated?: (pointLPS: Types.Point3) => boolean;
}
export default function pointInEllipse(ellipse: any, pointLPS: any, inverts?: Inverts): boolean;
declare const precalculatePointInEllipse: (ellipse: any, inverts?: Inverts) => Inverts;
export { precalculatePointInEllipse };
