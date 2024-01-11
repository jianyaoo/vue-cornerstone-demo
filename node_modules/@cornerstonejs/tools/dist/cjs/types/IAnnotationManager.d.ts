import AnnotationGroupSelector from './AnnotationGroupSelector';
import { Annotation, Annotations, GroupSpecificAnnotations } from './AnnotationTypes';
interface IAnnotationManager {
    getGroupKey: (annotationGroupSelector: AnnotationGroupSelector) => string;
    addAnnotation: (annotation: Annotation, groupKey: string) => void;
    getAnnotations: (groupKey: string, toolName?: string) => GroupSpecificAnnotations | Annotations;
    getAnnotation: (annotationUID: string) => Annotation;
    removeAnnotation: (annotationUID: string) => void;
    removeAnnotations: (groupKey: string) => void;
    removeAllAnnotations: () => void;
    getNumberOfAnnotations: (groupKey: string, toolName?: string) => number;
    getNumberOfAllAnnotations: () => number;
}
export default IAnnotationManager;
