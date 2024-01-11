import type { Types } from '@cornerstonejs/core';
import { SVGDrawingHelper } from '../types';
declare function drawLinkedTextBox(svgDrawingHelper: SVGDrawingHelper, annotationUID: string, textBoxUID: string, textLines: Array<string>, textBoxPosition: Types.Point2, annotationAnchorPoints: Array<Types.Point2>, textBox: unknown, options?: {}): SVGRect;
export default drawLinkedTextBox;
