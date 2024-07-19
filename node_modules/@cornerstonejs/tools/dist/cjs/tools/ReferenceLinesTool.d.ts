import { type Types } from '@cornerstonejs/core';
import { PublicToolProps, ToolProps, SVGDrawingHelper } from '../types';
import { ReferenceLineAnnotation } from '../types/ToolSpecificAnnotationTypes';
import AnnotationDisplayTool from './base/AnnotationDisplayTool';
declare class ReferenceLines extends AnnotationDisplayTool {
    static toolName: any;
    touchDragCallback: any;
    mouseDragCallback: any;
    _throttledCalculateCachedStats: any;
    editData: {
        renderingEngine: any;
        sourceViewportId: string;
        annotation: ReferenceLineAnnotation;
    } | null;
    isDrawing: boolean;
    isHandleOutsideImage: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    _init: () => void;
    onSetToolEnabled: () => void;
    onSetToolConfiguration: () => void;
    onCameraModified: (evt: Types.EventTypes.CameraModifiedEvent) => void;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
    isPerpendicular: (vec1: Types.Point3, vec2: Types.Point3) => boolean;
    private handleFullDimension;
    intersectInfiniteLines(line1Start: Types.Point2, line1End: Types.Point2, line2Start: Types.Point2, line2End: Types.Point2): number[];
    isParallel(vec1: Types.Point3, vec2: Types.Point3): boolean;
    isInBound(point: number[], dimensions: Types.Point3): boolean;
}
export default ReferenceLines;
