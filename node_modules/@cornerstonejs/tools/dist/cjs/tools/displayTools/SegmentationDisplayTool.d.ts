import { PublicToolProps, ToolProps } from '../../types';
import { BaseTool } from '../base';
import { SegmentationRepresentationConfig } from '../../types/SegmentationStateTypes';
declare class SegmentationDisplayTool extends BaseTool {
    static toolName: any;
    constructor(toolProps?: PublicToolProps, defaultToolProps?: ToolProps);
    onSetToolEnabled(): void;
    onSetToolDisabled(): void;
    renderSegmentation: (toolGroupId: string) => void;
    _getMergedRepresentationsConfig(toolGroupId: string): SegmentationRepresentationConfig;
}
export default SegmentationDisplayTool;
