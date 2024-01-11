import { BaseTool } from './base';
import { EventTypes, PublicToolProps, ToolProps } from '../types';
declare class PanTool extends BaseTool {
    static toolName: any;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    touchDragCallback(evt: EventTypes.InteractionEventType): void;
    mouseDragCallback(evt: EventTypes.InteractionEventType): void;
    _dragCallback(evt: EventTypes.InteractionEventType): void;
}
export default PanTool;
