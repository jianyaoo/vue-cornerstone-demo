import { Types } from '@cornerstonejs/core';
import { AnnotationTool } from '../tools';
import { Annotation, Annotations } from './AnnotationTypes';
declare type ToolAnnotationsPair = {
    tool: AnnotationTool;
    annotations: Annotations;
};
declare type ToolAnnotationPair = {
    tool: AnnotationTool;
    annotation: Annotation;
};
declare type ToolsWithMoveableHandles = ToolAnnotationPair & {
    handle: Types.Point3;
};
export { ToolsWithMoveableHandles, ToolAnnotationsPair, ToolAnnotationPair };
