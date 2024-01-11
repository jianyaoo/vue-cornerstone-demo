import type { Types } from '@cornerstonejs/core';
import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import { BoundsIJK } from '../types';
declare function getSphereBoundsInfo(circlePoints: [Types.Point3, Types.Point3], imageData: vtkImageData, viewport: any): {
    boundsIJK: BoundsIJK;
    centerWorld: Types.Point3;
    radiusWorld: number;
    topLeftWorld: Types.Point3;
    bottomRightWorld: Types.Point3;
};
export { getSphereBoundsInfo };
