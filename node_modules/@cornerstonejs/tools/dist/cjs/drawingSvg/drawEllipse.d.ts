import type { Types } from '@cornerstonejs/core';
import { SVGDrawingHelper } from '../types';
declare function drawEllipse(svgDrawingHelper: SVGDrawingHelper, annotationUID: string, ellipseUID: string, corner1: Types.Point2, corner2: Types.Point2, options?: {}, dataId?: string): void;
export default drawEllipse;
