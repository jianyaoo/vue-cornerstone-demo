import type { Types } from '@cornerstonejs/core';
declare const getSubPixelSpacingAndXYDirections: (viewport: Types.IStackViewport | Types.IVolumeViewport, subPixelResolution: number) => {
    spacing: Types.Point2;
    xDir: Types.Point3;
    yDir: Types.Point3;
};
export default getSubPixelSpacingAndXYDirections;
