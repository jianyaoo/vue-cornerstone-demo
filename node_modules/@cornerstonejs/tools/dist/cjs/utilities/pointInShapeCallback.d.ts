import { vec3 } from 'gl-matrix';
import type { Types } from '@cornerstonejs/core';
import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import BoundsIJK from '../types/BoundsIJK';
export declare type PointInShape = {
    value: number;
    index: number;
    pointIJK: vec3;
    pointLPS: vec3 | number[];
};
export declare type PointInShapeCallback = ({ value, index, pointIJK, pointLPS, }: {
    value: number;
    index: number;
    pointIJK: vec3;
    pointLPS: vec3;
}) => void;
export declare type ShapeFnCriteria = (pointLPS: vec3, pointIJK: vec3) => boolean;
export default function pointInShapeCallback(imageData: vtkImageData | Types.CPUImageData, pointInShapeFn: ShapeFnCriteria, callback?: PointInShapeCallback, boundsIJK?: BoundsIJK): Array<PointInShape>;
