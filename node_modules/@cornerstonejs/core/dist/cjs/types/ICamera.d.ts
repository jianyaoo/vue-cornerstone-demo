import Point3 from './Point3';
import Point2 from './Point2';
interface ICamera {
    focalPoint?: Point3;
    parallelProjection?: boolean;
    parallelScale?: number;
    scale?: number;
    position?: Point3;
    viewAngle?: number;
    viewPlaneNormal?: Point3;
    viewUp?: Point3;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    clippingRange?: Point2;
}
export default ICamera;
