import { Point3 } from '.';
import { ContourType } from '../enums';
export interface IContour {
    readonly id: string;
    readonly sizeInBytes: number;
    points: Point3[];
    color: any;
    _getSizeInBytes(): number;
    getPoints(): Point3[];
    getColor(): Point3;
    getType(): ContourType;
    getFlatPointsArray(): number[];
}
//# sourceMappingURL=IContour.d.ts.map