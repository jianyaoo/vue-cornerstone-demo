import type { Types } from '@cornerstonejs/core';
import { PublicToolProps, ToolProps, EventTypes, SVGDrawingHelper } from '../../types';
import RectangleROITool from '../annotation/RectangleROITool';
declare class RectangleROIThresholdTool extends RectangleROITool {
    static toolName: any;
    _throttledCalculateCachedStats: any;
    editData: {
        annotation: any;
        viewportIdsToRender: string[];
        handleIndex?: number;
        newAnnotation?: boolean;
        hasMoved?: boolean;
    } | null;
    isDrawing: boolean;
    isHandleOutsideImage: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    addNewAnnotation: (evt: EventTypes.InteractionEventType) => {
        highlighted: boolean;
        invalidated: boolean;
        metadata: {
            viewPlaneNormal: Types.Point3;
            enabledElement: Types.IEnabledElement;
            viewUp: Types.Point3;
            FrameOfReferenceUID: string;
            referencedImageId: any;
            toolName: string;
            volumeId: any;
        };
        data: {
            label: string;
            handles: {
                textBox: {
                    hasMoved: boolean;
                    worldPosition: any;
                    worldBoundingBox: any;
                };
                points: Types.Point3[];
                activeHandleIndex: any;
            };
            segmentationId: any;
        };
    };
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
}
export default RectangleROIThresholdTool;
