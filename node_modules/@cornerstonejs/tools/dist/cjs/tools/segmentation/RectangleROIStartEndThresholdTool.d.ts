import type { Types } from '@cornerstonejs/core';
import { PublicToolProps, ToolProps, EventTypes, SVGDrawingHelper } from '../../types';
import { RectangleROIStartEndThresholdAnnotation } from '../../types/ToolSpecificAnnotationTypes';
import RectangleROITool from '../annotation/RectangleROITool';
declare class RectangleROIStartEndThresholdTool extends RectangleROITool {
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
            spacingInNormal: number;
        };
        data: {
            label: string;
            startSlice: number;
            endSlice: number;
            cachedStats: {
                projectionPoints: any[];
                projectionPointsImageIds: any[];
            };
            handles: {
                textBox: {
                    hasMoved: boolean;
                    worldPosition: any;
                    worldBoundingBox: any;
                };
                points: Types.Point3[];
                activeHandleIndex: any;
            };
            labelmapUID: any;
        };
    };
    _computeProjectionPoints(annotation: RectangleROIStartEndThresholdAnnotation, imageVolume: Types.IImageVolume): void;
    _calculateCachedStatsTool(annotation: any, enabledElement: any): any;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
    _getEndSliceIndex(imageVolume: Types.IImageVolume, worldPos: Types.Point3, spacingInNormal: number, viewPlaneNormal: Types.Point3): number | undefined;
}
export default RectangleROIStartEndThresholdTool;
