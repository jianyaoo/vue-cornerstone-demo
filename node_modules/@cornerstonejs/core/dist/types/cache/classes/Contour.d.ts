import { Point3, ContourData, IContour } from '../../types';
import { ContourType } from '../../enums';
declare type ContourProps = {
    id: string;
    data: ContourData;
    color: Point3;
    segmentIndex: number;
};
export declare class Contour implements IContour {
    readonly id: string;
    readonly sizeInBytes: number;
    points: Point3[];
    color: Point3;
    type: ContourType;
    segmentIndex: number;
    constructor(props: ContourProps);
    _getSizeInBytes(): number;
    getPoints(): Point3[];
    getFlatPointsArray(): number[];
    getColor(): Point3;
    getType(): ContourType;
}
export default Contour;
//# sourceMappingURL=Contour.d.ts.map