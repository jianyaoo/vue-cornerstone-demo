import type { Types } from '@cornerstonejs/core';
import { PublicToolProps, ToolProps, SVGDrawingHelper } from '../types';
import AnnotationDisplayTool from './base/AnnotationDisplayTool';
import { Annotation } from '../types';
export interface SegmentationIntersectionAnnotation extends Annotation {
    data: {
        actorsWorldPointsMap: Map<string, Map<string, object>>;
    };
}
declare class SegmentationIntersectionTool extends AnnotationDisplayTool {
    static toolName: any;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    _init: () => void;
    onSetToolEnabled: () => void;
    onCameraModified: (evt: Types.EventTypes.CameraModifiedEvent) => void;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
}
export default SegmentationIntersectionTool;
