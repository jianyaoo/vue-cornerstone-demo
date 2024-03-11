import type { Annotation, EventTypes, PublicToolProps, ToolProps, AnnotationRenderContext } from '../../types';
import type { StyleSpecifier } from '../../types/AnnotationStyle';
import ContourBaseTool from './ContourBaseTool';
declare abstract class ContourSegmentationBaseTool extends ContourBaseTool {
    constructor(toolProps: PublicToolProps, defaultToolProps: ToolProps);
    protected isContourSegmentationTool(): boolean;
    protected createAnnotation(evt: EventTypes.InteractionEventType): Annotation;
    protected addAnnotation(annotation: Annotation, element: HTMLDivElement): string;
    protected cancelAnnotation(annotation: Annotation): void;
    protected getAnnotationStyle(context: {
        annotation: Annotation;
        styleSpecifier: StyleSpecifier;
    }): any;
    protected renderAnnotationInstance(renderContext: AnnotationRenderContext): boolean;
    private _getContourSegmentationStyle;
    private _getSegmentationRepresentation;
}
export { ContourSegmentationBaseTool as default, ContourSegmentationBaseTool };
