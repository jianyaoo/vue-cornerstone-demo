import type { Types } from '@cornerstonejs/core';
import { AnnotationTool } from '../base';
import { EventTypes, SVGDrawingHelper } from '../../types';
import { VideoRedactionAnnotation } from '../../types/ToolSpecificAnnotationTypes';
declare class VideoRedactionTool extends AnnotationTool {
    _throttledCalculateCachedStats: any;
    editData: {
        annotation: any;
        viewportUIDsToRender: string[];
        handleIndex?: number;
        newAnnotation?: boolean;
        hasMoved?: boolean;
    } | null;
    _configuration: any;
    isDrawing: boolean;
    isHandleOutsideImage: boolean;
    constructor(toolConfiguration?: {});
    addNewAnnotation: (evt: EventTypes.InteractionEventType) => VideoRedactionAnnotation;
    getHandleNearImagePoint: (element: any, annotation: any, canvasCoords: any, proximity: any) => any;
    isPointNearTool: (element: any, annotation: any, canvasCoords: any, proximity: any) => boolean;
    toolSelectedCallback: (evt: any, annotation: any, interactionType?: string) => void;
    handleSelectedCallback: (evt: any, annotation: any, handle: any, interactionType?: string) => void;
    _mouseUpCallback: (evt: any) => void;
    _mouseDragCallback: (evt: any) => void;
    cancel(element: any): any;
    _activateDraw: (element: any) => void;
    _deactivateDraw: (element: any) => void;
    _activateModify: (element: any) => void;
    _deactivateModify: (element: any) => void;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
    _getRectangleImageCoordinates: (points: Array<Types.Point2>) => {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    _getImageVolumeFromTargetUID(targetUID: any, renderingEngine: any): {
        imageVolume: any;
        viewport: any;
    };
    _calculateCachedStats: (annotation: any, viewPlaneNormal: any, viewUp: any, renderingEngine: any, enabledElement: any) => any;
    _isInsideVolume: (index1: any, index2: any, dimensions: any) => boolean;
    _getTargetStackUID(viewport: any): string;
    _getTargetVolumeUID: (scene: any) => any;
}
export default VideoRedactionTool;
