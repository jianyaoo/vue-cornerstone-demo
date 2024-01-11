import { BaseTool } from './base';
import type { Types } from '@cornerstonejs/core';
import { EventTypes, PublicToolProps, ToolProps } from '../types';
import { IPoints } from '../types';
declare class MagnifyTool extends BaseTool {
    static toolName: any;
    _bounds: any;
    editData: {
        referencedImageId: string;
        viewportIdsToRender: string[];
        enabledElement: Types.IEnabledElement;
        renderingEngine: Types.IRenderingEngine;
        currentPoints: IPoints;
    } | null;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    _getReferencedImageId(viewport: Types.IStackViewport | Types.IVolumeViewport): string;
    preMouseDownCallback: (evt: EventTypes.InteractionEventType) => boolean;
    preTouchStartCallback: (evt: EventTypes.InteractionEventType) => void;
    _createMagnificationViewport: () => void;
    _dragCallback: (evt: EventTypes.InteractionEventType) => void;
    _dragEndCallback: (evt: EventTypes.InteractionEventType) => void;
    _activateDraw: (element: HTMLDivElement) => void;
    _deactivateDraw: (element: HTMLDivElement) => void;
}
export default MagnifyTool;
