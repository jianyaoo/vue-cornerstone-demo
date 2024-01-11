import type { Types } from '@cornerstonejs/core';
import { ToolAnnotationPair, ToolAnnotationsPair } from '../types/InternalToolTypes';
export default function filterMoveableAnnotationTools(element: HTMLDivElement, ToolAndAnnotations: ToolAnnotationsPair[], canvasCoords: Types.Point2, interactionType?: string): ToolAnnotationPair[];
