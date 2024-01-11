import { EventTypes, PublicToolProps, ToolProps } from '../types';
import { BaseTool } from './base';
declare class TrackballRotateTool extends BaseTool {
    static toolName: any;
    touchDragCallback: (evt: EventTypes.InteractionEventType) => void;
    mouseDragCallback: (evt: EventTypes.InteractionEventType) => void;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    rotateCamera: (viewport: any, centerWorld: any, axis: any, angle: any) => void;
    _dragCallback(evt: EventTypes.InteractionEventType): void;
}
export default TrackballRotateTool;
