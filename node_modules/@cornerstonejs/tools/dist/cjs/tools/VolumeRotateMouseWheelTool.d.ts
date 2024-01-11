import { BaseTool } from './base';
import { PublicToolProps, ToolProps } from '../types';
import { MouseWheelEventType } from '../types/EventTypes';
declare class VolumeRotateMouseWheelTool extends BaseTool {
    static toolName: any;
    _configuration: any;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    mouseWheelCallback(evt: MouseWheelEventType): void;
}
export default VolumeRotateMouseWheelTool;
