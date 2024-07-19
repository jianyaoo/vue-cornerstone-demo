import { AnnotationTool } from './base';
import type { Types } from '@cornerstonejs/core';
import { EventTypes, ToolHandle, PublicToolProps, ToolProps, SVGDrawingHelper } from '../types';
import { AdvancedMagnifyAnnotation } from '../types/ToolSpecificAnnotationTypes';
import AdvancedMagnifyViewportManager from './AdvancedMagnifyViewportManager';
declare enum AdvancedMagnifyToolActions {
    ShowZoomFactorsList = "showZoomFactorsList"
}
declare class AdvancedMagnifyTool extends AnnotationTool {
    static toolName: any;
    static Actions: typeof AdvancedMagnifyToolActions;
    magnifyViewportManager: AdvancedMagnifyViewportManager;
    touchDragCallback: any;
    mouseDragCallback: any;
    editData: {
        annotation: any;
        viewportIdsToRender: Array<string>;
        handleIndex?: number;
        newAnnotation?: boolean;
        hasMoved?: boolean;
    } | null;
    isDrawing: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    addNewAnnotation: (evt: EventTypes.InteractionEventType) => AdvancedMagnifyAnnotation;
    onSetToolDisabled: () => void;
    isPointNearTool: (element: HTMLDivElement, annotation: AdvancedMagnifyAnnotation, canvasCoords: Types.Point2, proximity: number) => boolean;
    toolSelectedCallback: (evt: EventTypes.InteractionEventType, annotation: AdvancedMagnifyAnnotation) => void;
    handleSelectedCallback: (evt: EventTypes.InteractionEventType, annotation: AdvancedMagnifyAnnotation, handle: ToolHandle) => void;
    _endCallback: (evt: EventTypes.InteractionEventType) => void;
    _dragDrawCallback: (evt: EventTypes.InteractionEventType) => void;
    _dragModifyCallback: (evt: EventTypes.InteractionEventType) => void;
    _dragHandle: (evt: EventTypes.InteractionEventType) => void;
    cancel: (element: HTMLDivElement) => any;
    _activateModify: (element: any) => void;
    _deactivateModify: (element: any) => void;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
    showZoomFactorsList(evt: EventTypes.InteractionEventType, annotation: AdvancedMagnifyAnnotation): void;
    private _getZoomFactorsListDropdown;
    private _getCanvasHandlePoints;
}
export { AdvancedMagnifyTool as default };
