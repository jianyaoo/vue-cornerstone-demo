import { Annotation } from '../../types';
declare function setAnnotationLocked(annotation: Annotation, locked?: boolean): void;
declare function unlockAllAnnotations(): void;
declare function getAnnotationsLocked(): Array<Annotation>;
declare function isAnnotationLocked(annotation: Annotation): boolean;
declare function getAnnotationsLockedCount(): number;
declare function checkAndDefineIsLockedProperty(annotation: Annotation): void;
export { setAnnotationLocked, getAnnotationsLocked, getAnnotationsLockedCount, unlockAllAnnotations, isAnnotationLocked, checkAndDefineIsLockedProperty, };
