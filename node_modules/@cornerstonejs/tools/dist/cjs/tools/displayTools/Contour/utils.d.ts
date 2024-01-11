import { Types } from '@cornerstonejs/core';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import { ToolGroupSpecificContourRepresentation } from '../../../types';
export declare function getSegmentSpecificConfig(contourRepresentation: ToolGroupSpecificContourRepresentation, segmentId: string, index: number): import("../../../types/ContourTypes").ContourConfig;
export declare function validateGeometry(geometry: Types.IGeometry): void;
export declare function getPolyData(contourSet: Types.IContourSet): vtkPolyData;
