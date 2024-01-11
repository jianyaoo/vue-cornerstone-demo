import type { Types } from '@cornerstonejs/core';
import { SVGDrawingHelper } from '../types';
declare function drawTextBox(svgDrawingHelper: SVGDrawingHelper, annotationUID: string, textUID: string, textLines: Array<string>, position: Types.Point2, options?: {}): SVGRect;
export default drawTextBox;
