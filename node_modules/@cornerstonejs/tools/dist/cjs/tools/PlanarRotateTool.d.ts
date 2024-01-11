import { BaseTool } from './base';
import { PublicToolProps, ToolProps, EventTypes } from '../types';
declare class PlanarRotateTool extends BaseTool {
    static toolName: any;
    touchDragCallback: (evt: EventTypes.MouseDragEventType) => void;
    mouseDragCallback: (evt: EventTypes.MouseDragEventType) => void;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    _dragCallback(evt: EventTypes.MouseDragEventType): void;
}
export default PlanarRotateTool;
