import { ActorSliceRange, Point3 } from '../types';
export default function snapFocalPointToSlice(focalPoint: Point3, position: Point3, sliceRange: ActorSliceRange, viewPlaneNormal: Point3, spacingInNormalDirection: number, deltaFrames: number): {
    newFocalPoint: Point3;
    newPosition: Point3;
};
