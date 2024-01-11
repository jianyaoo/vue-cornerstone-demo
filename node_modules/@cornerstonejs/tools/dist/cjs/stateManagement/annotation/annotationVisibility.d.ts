import { Annotation } from '../../types';
declare function setAnnotationVisibility(annotationUID: string, visible?: boolean): void;
declare function showAllAnnotations(): void;
declare function isAnnotationVisible(annotationUID: string): boolean | undefined;
declare function checkAndDefineIsVisibleProperty(annotation: Annotation): void;
export { setAnnotationVisibility, showAllAnnotations, isAnnotationVisible, checkAndDefineIsVisibleProperty, };
