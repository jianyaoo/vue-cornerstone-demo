import { ContourData, IContour, Point3 } from './';
export interface IContourSet {
    readonly id: string;
    readonly sizeInBytes: number;
    readonly frameOfReferenceUID: string;
    contours: IContour[];
    _createEachContour(data: ContourData[]): void;
    getSizeInBytes(): number;
    getSegmentIndex(): number;
    getCentroid(): Point3;
    getColor(): any;
    getContours(): IContour[];
    getFlatPointsArray(): Point3[];
    getNumberOfContours(): number;
    getTotalNumberOfPoints(): number;
    getNumberOfPointsArray(): number[];
    getPointsInContour(contourIndex: number): Point3[];
    getNumberOfPointsInAContour(contourIndex: number): number;
}
