import { SurfaceData, Point3, ISurface, RGB } from '../../types';
declare type SurfaceProps = {
    id: string;
    data: SurfaceData;
    frameOfReferenceUID: string;
    color?: Point3;
};
export declare class Surface implements ISurface {
    readonly id: string;
    readonly sizeInBytes: number;
    readonly frameOfReferenceUID: string;
    private color;
    private points;
    private polys;
    constructor(props: SurfaceProps);
    _getSizeInBytes(): number;
    getColor(): RGB;
    getPoints(): number[];
    getPolys(): number[];
    setColor(color: RGB): void;
    setPoints(points: number[]): void;
    setPolys(polys: number[]): void;
    getSizeInBytes(): number;
}
export {};
