import { Annotation, Annotations, AnnotationState, GroupSpecificAnnotations } from '../../types/AnnotationTypes';
import { AnnotationGroupSelector, IAnnotationManager } from '../../types';
import { Types } from '@cornerstonejs/core';
declare class FrameOfReferenceSpecificAnnotationManager implements IAnnotationManager {
    private annotations;
    readonly uid: string;
    constructor(uid?: string);
    getGroupKey: (annotationGroupSelector: AnnotationGroupSelector) => string;
    _imageVolumeModifiedHandler: (evt: Types.EventTypes.ImageVolumeModifiedEvent) => void;
    getFramesOfReference: () => Array<string>;
    getAnnotations: (groupKey: string, toolName?: string) => GroupSpecificAnnotations | Annotations;
    getAnnotation: (annotationUID: string) => Annotation | undefined;
    getNumberOfAnnotations: (groupKey: string, toolName?: string) => number;
    addAnnotation: (annotation: Annotation, groupKey?: string) => void;
    removeAnnotation: (annotationUID: string) => void;
    removeAnnotations: (groupKey: string, toolName?: string) => void;
    saveAnnotations: (groupKey?: string, toolName?: string) => AnnotationState | GroupSpecificAnnotations | Annotations;
    restoreAnnotations: (state: AnnotationState | GroupSpecificAnnotations | Annotations, groupKey?: string, toolName?: string) => void;
    getNumberOfAllAnnotations: () => number;
    removeAllAnnotations: () => void;
}
declare const defaultFrameOfReferenceSpecificAnnotationManager: FrameOfReferenceSpecificAnnotationManager;
export { defaultFrameOfReferenceSpecificAnnotationManager };
export default FrameOfReferenceSpecificAnnotationManager;
