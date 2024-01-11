import type { Types } from '@cornerstonejs/core';
import { EventTypes, PublicToolProps, SVGDrawingHelper, ToolProps } from '../../types';
import ProbeTool from './ProbeTool';
import { ProbeAnnotation } from '../../types/ToolSpecificAnnotationTypes';
declare class DragProbeTool extends ProbeTool {
    static toolName: any;
    touchDragCallback: any;
    mouseDragCallback: any;
    editData: {
        annotation: any;
        viewportIdsToRender: string[];
        newAnnotation?: boolean;
    } | null;
    eventDispatchDetail: {
        viewportId: string;
        renderingEngineId: string;
    };
    isDrawing: boolean;
    isHandleOutsideImage: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    postMouseDownCallback: (evt: EventTypes.InteractionEventType) => ProbeAnnotation;
    postTouchStartCallback: (evt: EventTypes.InteractionEventType) => ProbeAnnotation;
    renderAnnotation: (enabledElement: Types.IEnabledElement, svgDrawingHelper: SVGDrawingHelper) => boolean;
}
export default DragProbeTool;
