import { BaseTool } from '../base';
import { PublicToolProps, ToolProps, EventTypes } from '../../types';
declare class PaintFillTool extends BaseTool {
    static toolName: any;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    preMouseDownCallback: (evt: EventTypes.InteractionEventType) => boolean;
    private getFramesModified;
    private generateHelpers;
    private getFixedDimension;
    private generateFloodFillGetter;
    private generateGetScalarDataPositionFromPlane;
}
export default PaintFillTool;
