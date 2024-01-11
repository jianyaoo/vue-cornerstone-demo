import AnnotationDisplayTool from './base/AnnotationDisplayTool';
import { ScaleOverlayAnnotation } from '../types/ToolSpecificAnnotationTypes';
import type { Types } from '@cornerstonejs/core';
import { EventTypes, PublicToolProps, ToolProps, SVGDrawingHelper } from '../types';
declare class ScaleOverlayTool extends AnnotationDisplayTool {
    static toolName: any;
    touchDragCallback: any;
    mouseDragCallback: any;
    _throttledCalculateCachedStats: any;
    editData: {
        renderingEngine: any;
        viewport: any;
        annotation: ScaleOverlayAnnotation;
    } | null;
    isDrawing: boolean;
    isHandleOutsideImage: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    _init: () => void;
    onSetToolEnabled: () => void;
    onCameraModified: (evt: Types.EventTypes.CameraModifiedEvent) => void;
    renderAnnotation(enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper): boolean;
    _getTextLines(scaleSize: number): string[] | undefined;
    computeScaleSize: (worldWidthViewport: number, worldHeightViewport: number, location: any) => any;
    computeEndScaleTicks: (canvasCoordinates: any, location: any) => {
        endTick1: any[][];
        endTick2: any[][];
    };
    computeInnerScaleTicks: (scaleSize: number, location: string, annotationUID: string, leftTick: any[][], rightTick: any[][]) => {
        tickIds: any[];
        tickUIDs: any[];
        tickCoordinates: any[];
    };
    computeWorldScaleCoordinates: (scaleSize: any, location: any, pointSet: any) => any;
    computeCanvasScaleCoordinates: (canvasSize: any, canvasCoordinates: any, vscaleBounds: any, hscaleBounds: any, location: any) => any;
    computeScaleBounds: (canvasSize: any, horizontalReduction: any, verticalReduction: any, location: any) => {
        height: any;
        width: any;
    };
}
export default ScaleOverlayTool;
