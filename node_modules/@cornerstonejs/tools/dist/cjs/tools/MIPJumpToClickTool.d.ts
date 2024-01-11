import { BaseTool } from './base';
import { PublicToolProps, ToolProps } from '../types';
declare class MIPJumpToClickTool extends BaseTool {
    static toolName: any;
    _bounds: any;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    mouseClickCallback(evt: any): void;
}
export default MIPJumpToClickTool;
