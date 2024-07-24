import { AnnotationTool } from './base';
import type { Types } from '@cornerstonejs/core';
import { Annotation, Annotations, EventTypes, ToolHandle, PublicToolProps, ToolProps, InteractionTypes, SVGDrawingHelper } from '../types';
interface CrosshairsAnnotation extends Annotation {
    data: {
        handles: {
            rotationPoints: any[];
            slabThicknessPoints: any[];
            activeOperation: number | null;
            toolCenter: Types.Point3;
        };
        activeViewportIds: string[];
        viewportId: string;
    };
}
declare class CrosshairsTool extends AnnotationTool {
    static toolName: any;
    toolCenter: Types.Point3;
    _getReferenceLineColor?: (viewportId: string) => string;
    _getReferenceLineControllable?: (viewportId: string) => boolean;
    _getReferenceLineDraggableRotatable?: (viewportId: string) => boolean;
    _getReferenceLineSlabThicknessControlsOn?: (viewportId: string) => boolean;
    editData: {
        annotation: any;
    } | null;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    initializeViewport: ({ renderingEngineId, viewportId, }: Types.IViewportId) => {
        normal: Types.Point3;
        point: Types.Point3;
    };
    _getViewportsInfo: () => any[];
    onSetToolActive(): void;
    onSetToolPassive(): void;
    onSetToolEnabled(): void;
    onSetToolDisabled(): void;
    resetCrosshairs: () => void;
    computeToolCenter: (viewportsInfo: any) => void;
    addNewAnnotation: (evt: EventTypes.InteractionEventType) => CrosshairsAnnotation;
    cancel: () => void;
    getHandleNearImagePoint(element: HTMLDivElement, annotation: Annotation, canvasCoords: Types.Point2, proximity: number): ToolHandle | undefined;
    handleSelectedCallback: (evt: EventTypes.InteractionEventType, annotation: Annotation) => void;
    isPointNearTool: (element: HTMLDivElement, annotation: CrosshairsAnnotation, canvasCoords: Types.Point2, proximity: number) => boolean;
    toolSelectedCallback: (evt: EventTypes.InteractionEventType, annotation: Annotation, interactionType: InteractionTypes) => void;
    onCameraModified: (evt: any) => void;
    onResetCamera: (evt: any) => void;
    mouseMoveCallback: (evt: EventTypes.MouseMoveEventType, filteredToolAnnotations: Annotations) => boolean;
    filterInteractableAnnotationsForElement: (element: any, annotations: any) => any;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
    _getAnnotations: (enabledElement: Types.IEnabledElement) => Annotation[];
    _onNewVolume: (e: any) => void;
    _unsubscribeToViewportNewVolumeSet(viewportsInfo: any): void;
    _subscribeToViewportNewVolumeSet(viewports: any): void;
    _autoPanViewportIfNecessary(viewportId: string, renderingEngine: Types.IRenderingEngine): void;
    _areViewportIdArraysEqual: (viewportIdArrayOne: any, viewportIdArrayTwo: any) => boolean;
    _getAnnotationsForViewportsWithDifferentCameras: (enabledElement: any, annotations: any) => any;
    _filterViewportWithSameOrientation: (enabledElement: any, referenceAnnotation: any, annotations: any) => any;
    _filterAnnotationsByUniqueViewportOrientations: (enabledElement: any, annotations: any) => any[];
    _checkIfViewportsRenderingSameScene: (viewport: any, otherViewport: any) => boolean;
    _jump: (enabledElement: any, jumpWorld: any) => boolean;
    _activateModify: (element: any) => void;
    _deactivateModify: (element: any) => void;
    _endCallback: (evt: EventTypes.InteractionEventType) => void;
    _dragCallback: (evt: EventTypes.InteractionEventType) => void;
    setSlabThickness(viewport: any, slabThickness: any): void;
    _isClockWise(a: any, b: any, c: any): boolean;
    _applyDeltaShiftToSelectedViewportCameras(renderingEngine: any, viewportsAnnotationsToUpdate: any, delta: any): void;
    _applyDeltaShiftToViewportCamera(renderingEngine: Types.IRenderingEngine, annotation: any, delta: any): void;
    _pointNearReferenceLine: (annotation: any, canvasCoords: any, proximity: any, lineViewport: any) => boolean;
    _getRotationHandleNearImagePoint(viewport: any, annotation: any, canvasCoords: any, proximity: any): any;
    _getSlabThicknessHandleNearImagePoint(viewport: any, annotation: any, canvasCoords: any, proximity: any): any;
    _pointNearTool(element: any, annotation: any, canvasCoords: any, proximity: any): boolean;
}
export default CrosshairsTool;
