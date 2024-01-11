import type { Types } from '@cornerstonejs/core';
import { SVGDrawingHelper } from '../types';
declare function drawEllipseByCoordinates(svgDrawingHelper: SVGDrawingHelper, annotationUID: string, ellipseUID: string, canvasCoordinates: [Types.Point2, Types.Point2, Types.Point2, Types.Point2], options?: {}, dataId?: string): void;
export default drawEllipseByCoordinates;
