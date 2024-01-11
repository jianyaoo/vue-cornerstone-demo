import { VolumeActor } from './IActor';
import Point3 from './Point3';
declare type ActorSliceRange = {
    actor: VolumeActor;
    viewPlaneNormal: Point3;
    focalPoint: Point3;
    min: number;
    max: number;
    current: number;
};
export default ActorSliceRange;
