import type { Types } from '@cornerstonejs/core';
import { PublicToolProps, ToolProps, SVGDrawingHelper, Annotation } from '../types';
import AnnotationDisplayTool from './base/AnnotationDisplayTool';
export interface OverlayGridAnnotation extends Annotation {
    data: {
        viewportData: Map<string, object>;
        pointSets: Array<object>;
    };
}
declare class OverlayGridTool extends AnnotationDisplayTool {
    static toolName: any;
    touchDragCallback: any;
    mouseDragCallback: any;
    _throttledCalculateCachedStats: any;
    isDrawing: boolean;
    isHandleOutsideImage: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    onSetToolEnabled: () => void;
    onSetToolActive: () => void;
    _init: () => void;
    calculateImageIdPointSets: (imageId: string) => {
        pointSet1: Types.Point3[];
        pointSet2: Types.Point3[];
    };
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
    private initializeViewportData;
    private isPerpendicular;
    private isParallel;
    private getImageIdNormal;
}
export default OverlayGridTool;
