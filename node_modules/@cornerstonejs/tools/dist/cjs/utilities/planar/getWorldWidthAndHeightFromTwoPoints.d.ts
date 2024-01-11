import type { Types } from '@cornerstonejs/core';
export default function getWorldWidthAndHeightFromTwoPoints(viewPlaneNormal: Types.Point3, viewUp: Types.Point3, worldPos1: Types.Point3, worldPos2: Types.Point3): {
    worldWidth: number;
    worldHeight: number;
};
