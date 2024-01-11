import type { Types } from '@cornerstonejs/core';
import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import { PointInShapeCallback } from './pointInShapeCallback';
export default function pointInSurroundingSphereCallback(imageData: vtkImageData, circlePoints: [Types.Point3, Types.Point3], callback: PointInShapeCallback, viewport?: Types.IVolumeViewport): void;
