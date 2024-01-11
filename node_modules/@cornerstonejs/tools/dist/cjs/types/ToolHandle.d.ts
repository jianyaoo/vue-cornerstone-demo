import type { Types } from '@cornerstonejs/core';
declare type AnnotationHandle = Types.Point3;
declare type TextBoxHandle = {
    hasMoved: boolean;
    worldBoundingBox: {
        bottomLeft: Types.Point3;
        bottomRight: Types.Point3;
        topLeft: Types.Point3;
        topRight: Types.Point3;
    };
    worldPosition: Types.Point3;
};
declare type ToolHandle = AnnotationHandle | TextBoxHandle;
export default ToolHandle;
export type { AnnotationHandle, TextBoxHandle };
