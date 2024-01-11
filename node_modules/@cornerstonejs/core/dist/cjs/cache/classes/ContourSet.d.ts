import { Point3, IContourSet, IContour, ContourData } from '../../types';
import Contour from './Contour';
declare type ContourSetProps = {
    id: string;
    data: ContourData[];
    frameOfReferenceUID: string;
    segmentIndex: number;
    color?: Point3;
};
export declare class ContourSet implements IContourSet {
    readonly id: string;
    readonly sizeInBytes: number;
    readonly frameOfReferenceUID: string;
    private color;
    private segmentIndex;
    private polyData;
    private centroid;
    contours: IContour[];
    constructor(props: ContourSetProps);
    _createEachContour(contourDataArray: ContourData[]): void;
    _updateContourSetCentroid(): void;
    _getSizeInBytes(): number;
    getCentroid(): Point3;
    getSegmentIndex(): number;
    getColor(): Point3;
    getContours(): IContour[];
    getSizeInBytes(): number;
    getFlatPointsArray(): Point3[];
    getNumberOfContours(): number;
    getTotalNumberOfPoints(): number;
    getNumberOfPointsArray(): number[];
    getPointsInContour(contourIndex: number): Point3[];
    getNumberOfPointsInAContour(contourIndex: number): number;
    private _getDistance;
}
export default Contour;
