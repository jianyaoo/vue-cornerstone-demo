import { vec3 } from 'gl-matrix';
import { Point3 } from '../types';
declare type SortedImageIdsItem = {
    zSpacing: number;
    origin: Point3;
    sortedImageIds: Array<string>;
};
export default function sortImageIdsAndGetSpacing(imageIds: Array<string>, scanAxisNormal?: vec3): SortedImageIdsItem;
export {};
