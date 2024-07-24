import { EventTypes, PublicToolProps, ToolProps } from '../types';
import { BaseTool } from './base';
declare class TrackballRotateTool extends BaseTool {
    static toolName: any;
    touchDragCallback: (evt: EventTypes.InteractionEventType) => void;
    mouseDragCallback: (evt: EventTypes.InteractionEventType) => void;
    cleanUp: () => void;
    _resizeObservers: Map<any, any>;
    _viewportAddedListener: (evt: any) => void;
    _hasResolutionChanged: boolean;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    preMouseDownCallback: (evt: EventTypes.InteractionEventType) => boolean;
    _getViewportsInfo: () => any[];
    onSetToolActive: () => void;
    onSetToolDisabled: () => void;
    rotateCamera: (viewport: any, centerWorld: any, axis: any, angle: any) => void;
    _dragCallback(evt: EventTypes.InteractionEventType): void;
}
export default TrackballRotateTool;
