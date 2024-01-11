import { ToolAnnotationsPair } from '../types/InternalToolTypes';
import type AnnotationTool from '../tools/base/AnnotationTool';
export default function filterToolsWithAnnotationsForElement(element: HTMLDivElement, tools: AnnotationTool[]): ToolAnnotationsPair[];
