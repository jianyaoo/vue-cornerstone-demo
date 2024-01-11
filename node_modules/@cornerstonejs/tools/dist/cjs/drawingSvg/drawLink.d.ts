import type { Types } from '@cornerstonejs/core';
import { PlanarBoundingBox, SVGDrawingHelper } from '../types';
declare function drawLink(svgDrawingHelper: SVGDrawingHelper, annotationUID: string, linkUID: string, annotationAnchorPoints: Array<Types.Point2>, refPoint: Types.Point2, boundingBox: PlanarBoundingBox, options?: {}): void;
export default drawLink;
