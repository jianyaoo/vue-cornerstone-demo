import { Types } from '@cornerstonejs/core';
import { ToolGroupSpecificRepresentation } from '../../../types/SegmentationStateTypes';
declare function removeSegmentationRepresentation(toolGroupId: string, segmentationRepresentationUID: string, renderImmediate?: boolean): void;
declare function render(viewport: Types.IVolumeViewport, representation: ToolGroupSpecificRepresentation): Promise<void>;
declare const _default: {
    render: typeof render;
    removeSegmentationRepresentation: typeof removeSegmentationRepresentation;
};
export default _default;
export { render, removeSegmentationRepresentation };
