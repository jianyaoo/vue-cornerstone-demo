import type { Types } from '@cornerstonejs/core';
import { BaseTool } from '../base';
import { PublicToolProps, ToolProps, EventTypes, ToolGroupSpecificRepresentation } from '../../types';
declare class SegmentSelectTool extends BaseTool {
    static toolName: any;
    private hoverTimer;
    static SelectMode: {
        Inside: string;
        Border: string;
    };
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    mouseMoveCallback: (evt: EventTypes.InteractionEventType) => boolean;
    onSetToolEnabled: () => void;
    onSetToolActive: () => void;
    onSetToolDisabled: () => void;
    _setActiveSegment(evt?: EventTypes.InteractionEventType): void;
    _setActiveSegmentForType(activeSegmentationReps: ToolGroupSpecificRepresentation, worldPoint: Types.Point3, viewport: Types.IStackViewport | Types.IVolumeViewport): void;
}
export default SegmentSelectTool;
