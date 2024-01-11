import { ContourType } from '../enums';
import Point3 from './Point3';
declare type PublicContourSetData = ContourSetData;
declare type ContourSetData = {
    id: string;
    data: ContourData[];
    frameOfReferenceUID: string;
    color?: Point3;
    segmentIndex?: number;
};
declare type ContourData = {
    points: Point3[];
    type: ContourType;
    color: Point3;
    segmentIndex: number;
};
export type { PublicContourSetData, ContourSetData, ContourData };
//# sourceMappingURL=ContourData.d.ts.map