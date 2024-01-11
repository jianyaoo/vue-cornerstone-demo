declare function setAnnotationSelected(annotationUID: string, selected?: boolean, preserveSelected?: boolean): void;
declare function deselectAnnotation(annotationUID?: string): void;
declare function getAnnotationsSelected(): Array<string>;
declare function getAnnotationsSelectedByToolName(toolName: string): Array<string>;
declare function isAnnotationSelected(annotationUID: string): boolean;
declare function getAnnotationsSelectedCount(): number;
export { setAnnotationSelected, getAnnotationsSelected, getAnnotationsSelectedByToolName, getAnnotationsSelectedCount, deselectAnnotation, isAnnotationSelected, };
