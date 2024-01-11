import type { Types } from '@cornerstonejs/core';
declare type Annotation = {
    annotationUID?: string;
    highlighted?: boolean;
    isLocked?: boolean;
    isVisible?: boolean;
    invalidated?: boolean;
    metadata: {
        cameraPosition?: Types.Point3;
        cameraFocalPoint?: Types.Point3;
        viewPlaneNormal?: Types.Point3;
        viewUp?: Types.Point3;
        FrameOfReferenceUID: string;
        toolName: string;
        referencedImageId?: string;
        volumeId?: string;
    };
    data: {
        handles?: {
            points?: Types.Point3[];
            activeHandleIndex?: number | null;
            textBox?: {
                hasMoved: boolean;
                worldPosition: Types.Point3;
                worldBoundingBox?: {
                    topLeft: Types.Point3;
                    topRight: Types.Point3;
                    bottomLeft: Types.Point3;
                    bottomRight: Types.Point3;
                };
            };
            [key: string]: any;
        };
        [key: string]: any;
        cachedStats?: unknown;
    };
};
declare type Annotations = Array<Annotation>;
declare type GroupSpecificAnnotations = {
    [toolName: string]: Annotations;
};
declare type AnnotationState = {
    [key: string]: GroupSpecificAnnotations;
};
export { Annotation, Annotations, GroupSpecificAnnotations, AnnotationState };
