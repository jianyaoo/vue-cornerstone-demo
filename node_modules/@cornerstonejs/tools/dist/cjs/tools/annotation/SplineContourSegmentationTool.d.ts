import { PublicToolProps } from '../../types';
import SplineROITool from './SplineROITool';
declare class SplineContourSegmentationTool extends SplineROITool {
    static toolName: any;
    constructor(toolProps: PublicToolProps);
    protected isContourSegmentationTool(): boolean;
}
export default SplineContourSegmentationTool;
