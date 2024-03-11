import type { Types } from '@cornerstonejs/core';
import LivewireContourTool from './LivewireContourTool';
import type { ContourSegmentationAnnotation } from '../../types';
declare class LivewireContourSegmentationTool extends LivewireContourTool {
    static toolName: any;
    updateInterpolatedAnnotation(annotation: ContourSegmentationAnnotation, enabledElement: Types.IEnabledElement): void;
    protected renderAnnotationInstance(renderContext: any): boolean;
    protected isContourSegmentationTool(): boolean;
}
export default LivewireContourSegmentationTool;
