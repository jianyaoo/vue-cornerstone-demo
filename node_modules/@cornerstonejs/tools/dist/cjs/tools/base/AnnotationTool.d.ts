import type { Types } from '@cornerstonejs/core';
import AnnotationDisplayTool from './AnnotationDisplayTool';
import { Annotation, Annotations, EventTypes, ToolHandle, InteractionTypes, ToolProps, PublicToolProps } from '../../types';
import { StyleSpecifier } from '../../types/AnnotationStyle';
declare abstract class AnnotationTool extends AnnotationDisplayTool {
    static createAnnotation(...annotationBaseData: any[]): Annotation;
    static createAnnotationForViewport(viewport: any, ...annotationBaseData: any[]): Annotation;
    static createAndAddAnnotation(viewport: any, ...annotationBaseData: any[]): void;
    static toolName: any;
    constructor(toolProps: PublicToolProps, defaultToolProps: ToolProps);
    abstract addNewAnnotation(evt: EventTypes.InteractionEventType, interactionType: InteractionTypes): Annotation;
    abstract cancel(element: HTMLDivElement): any;
    abstract handleSelectedCallback(evt: EventTypes.InteractionEventType, annotation: Annotation, handle: ToolHandle, interactionType: InteractionTypes): void;
    abstract toolSelectedCallback(evt: EventTypes.InteractionEventType, annotation: Annotation, interactionType: InteractionTypes, canvasCoords?: Types.Point2): void;
    abstract isPointNearTool(element: HTMLDivElement, annotation: Annotation, canvasCoords: Types.Point2, proximity: number, interactionType: string): boolean;
    mouseMoveCallback: (evt: EventTypes.MouseMoveEventType, filteredAnnotations?: Annotations) => boolean;
    getHandleNearImagePoint(element: HTMLDivElement, annotation: Annotation, canvasCoords: Types.Point2, proximity: number): ToolHandle | undefined;
    getLinkedTextBoxStyle(specifications: StyleSpecifier, annotation?: Annotation): Record<string, unknown>;
    isSuvScaled(viewport: Types.IStackViewport | Types.IVolumeViewport, targetId: string, imageId?: string): boolean;
    protected getAnnotationStyle(context: {
        annotation: Annotation;
        styleSpecifier: StyleSpecifier;
    }): {
        visibility: boolean;
        locked: boolean;
        color: string;
        lineWidth: number;
        lineDash: string;
        lineOpacity: number;
        fillColor: string;
        fillOpacity: number;
        shadow: boolean;
        textbox: Record<string, unknown>;
    };
    private _imagePointNearToolOrHandle;
}
export default AnnotationTool;
