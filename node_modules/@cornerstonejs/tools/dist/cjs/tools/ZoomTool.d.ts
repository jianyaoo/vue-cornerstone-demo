import { Types } from '@cornerstonejs/core';
import { BaseTool } from './base';
import { EventTypes, PublicToolProps, ToolProps } from '../types';
declare class ZoomTool extends BaseTool {
    static toolName: any;
    touchDragCallback: (evt: EventTypes.InteractionEventType) => void;
    mouseDragCallback: (evt: EventTypes.InteractionEventType) => void;
    initialMousePosWorld: Types.Point3;
    dirVec: Types.Point3;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    preMouseDownCallback: (evt: EventTypes.InteractionEventType) => boolean;
    preTouchStartCallback: (evt: EventTypes.InteractionEventType) => boolean;
    _pinchCallback(evt: EventTypes.InteractionEventType): void;
    _dragCallback(evt: EventTypes.InteractionEventType): void;
    _dragParallelProjection: (evt: EventTypes.InteractionEventType, viewport: Types.IStackViewport | Types.IVolumeViewport, camera: Types.ICamera, pinch?: boolean) => void;
    _dragPerspectiveProjection: (evt: EventTypes.InteractionEventType, viewport: Types.IStackViewport | Types.IVolumeViewport, camera: Types.ICamera, pinch?: boolean) => void;
    _panCallback(evt: EventTypes.InteractionEventType): void;
}
export default ZoomTool;
