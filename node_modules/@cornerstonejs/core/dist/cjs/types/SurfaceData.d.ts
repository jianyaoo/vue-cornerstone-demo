import Point3 from './Point3';
declare type PublicSurfaceData = {
    id: string;
    data: SurfaceData;
    frameOfReferenceUID: string;
    color?: Point3;
};
declare type SurfaceData = {
    points: number[];
    polys: number[];
};
export type { PublicSurfaceData, SurfaceData };
