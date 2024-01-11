import { IStackViewport, Point3 } from '../types';
export default function getClosestStackImageIndexForPoint(point: Point3, viewport: IStackViewport): number | null;
export declare function calculateMinimalDistanceForStackViewport(point: Point3, viewport: IStackViewport): {
    distance: number;
    index: number;
} | null;
