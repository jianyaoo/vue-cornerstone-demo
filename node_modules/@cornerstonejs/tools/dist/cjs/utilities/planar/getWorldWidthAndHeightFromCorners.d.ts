import type { Types } from '@cornerstonejs/core';
export default function getWorldWidthAndHeightFromCorners(viewPlaneNormal: Types.Point3, viewUp: Types.Point3, topLeftWorld: Types.Point3, bottomRightWorld: Types.Point3): {
    worldWidth: number;
    worldHeight: number;
};
