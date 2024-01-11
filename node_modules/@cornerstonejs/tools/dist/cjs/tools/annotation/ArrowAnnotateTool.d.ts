import type { Types } from '@cornerstonejs/core';
import { AnnotationTool } from '../base';
import { EventTypes, ToolHandle, PublicToolProps, ToolProps, SVGDrawingHelper } from '../../types';
import { ArrowAnnotation } from '../../types/ToolSpecificAnnotationTypes';
declare class ArrowAnnotateTool extends AnnotationTool {
    static toolName: any;
    touchDragCallback: any;
    mouseDragCallback: any;
    _throttledCalculateCachedStats: any;
    editData: {
        annotation: any;
        viewportIdsToRender: string[];
        handleIndex?: number;
        movingTextBox?: boolean;
        newAnnotation?: boolean;
        hasMoved?: boolean;
    } | null;
    isDrawing: boolean;
    isHandleOutsideImage: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    addNewAnnotation: (evt: EventTypes.InteractionEventType) => ArrowAnnotation;
    isPointNearTool: (element: HTMLDivElement, annotation: ArrowAnnotation, canvasCoords: Types.Point2, proximity: number) => boolean;
    toolSelectedCallback: (evt: EventTypes.InteractionEventType, annotation: ArrowAnnotation) => void;
    handleSelectedCallback(evt: EventTypes.InteractionEventType, annotation: ArrowAnnotation, handle: ToolHandle): void;
    _endCallback: (evt: EventTypes.InteractionEventType) => void;
    _dragCallback: (evt: EventTypes.InteractionEventType) => void;
    touchTapCallback: (evt: EventTypes.TouchTapEventType) => void;
    doubleClickCallback: (evt: EventTypes.TouchTapEventType) => void;
    _doneChangingTextCallback(element: any, annotation: any, updatedText: any): void;
    cancel: (element: HTMLDivElement) => any;
    _activateModify: (element: HTMLDivElement) => void;
    _deactivateModify: (element: HTMLDivElement) => void;
    _activateDraw: (element: HTMLDivElement) => void;
    _deactivateDraw: (element: HTMLDivElement) => void;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
    _isInsideVolume(index1: any, index2: any, dimensions: any): boolean;
}
export default ArrowAnnotateTool;
