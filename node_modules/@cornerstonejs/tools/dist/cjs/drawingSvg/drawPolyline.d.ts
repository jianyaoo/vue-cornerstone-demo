import type { Types } from '@cornerstonejs/core';
import { SVGDrawingHelper } from '../types';
export default function drawPolyline(svgDrawingHelper: SVGDrawingHelper, annotationUID: string, polylineUID: string, points: Types.Point2[], options: {
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    width?: number;
    lineWidth?: number;
    lineDash?: string;
    closePath?: boolean;
}): void;
