import type { Types } from '@cornerstonejs/core';
import { EventTypes, PublicToolProps, ToolProps, SVGDrawingHelper, Annotation, Annotations } from '../types';
import AnnotationDisplayTool from './base/AnnotationDisplayTool';
declare class ReferenceCursors extends AnnotationDisplayTool {
    static toolName: any;
    touchDragCallback: any;
    mouseDragCallback: any;
    _throttledCalculateCachedStats: any;
    isDrawing: boolean;
    isHandleOutsideImage: boolean;
    _elementWithCursor: null | HTMLDivElement;
    _currentCursorWorldPosition: null | Types.Point3;
    _currentCanvasPosition: null | Types.Point2;
    _disableCursorEnabled: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    mouseMoveCallback: (evt: EventTypes.InteractionEventType) => boolean;
    onSetToolActive(): void;
    onSetToolDisabled(): void;
    createInitialAnnotation: (worldPos: Types.Point3, element: HTMLDivElement) => void;
    getActiveAnnotation(element: HTMLDivElement): null | Annotation;
    updateAnnotationPosition(element: HTMLDivElement, annotation: Annotation): void;
    onCameraModified: (evt: any) => void;
    filterInteractableAnnotationsForElement(element: HTMLDivElement, annotations: Annotations): Annotations;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
    updateViewportImage(viewport: Types.IStackViewport | Types.IVolumeViewport): void;
}
export default ReferenceCursors;
