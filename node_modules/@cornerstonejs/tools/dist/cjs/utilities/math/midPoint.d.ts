import { Types } from '@cornerstonejs/core';
declare const midPoint: (...args: (Types.Point2 | Types.Point3)[]) => Types.Point2 | Types.Point3;
declare const midPoint2: (...args: Types.Point2[]) => Types.Point2;
export default midPoint;
export { midPoint2 };
