import type { Types } from '@cornerstonejs/core';
import type { RepresentationConfig, Segmentation, SegmentationRepresentationConfig, SegmentationState, SegmentSpecificRepresentationConfig, ToolGroupSpecificRepresentation, ToolGroupSpecificRepresentations } from '../../types/SegmentationStateTypes';
export default class SegmentationStateManager {
    private state;
    readonly uid: string;
    constructor(uid?: string);
    getState(): SegmentationState;
    getToolGroups(): string[];
    getColorLUT(lutIndex: number): Types.ColorLUT | undefined;
    getNextColorLUTIndex(): number;
    resetState(): void;
    getSegmentation(segmentationId: string): Segmentation | undefined;
    addSegmentation(segmentation: Segmentation): void;
    getSegmentationRepresentations(toolGroupId: string): ToolGroupSpecificRepresentations | undefined;
    getAllSegmentationRepresentations(): Record<string, ToolGroupSpecificRepresentation[]>;
    addSegmentationRepresentation(toolGroupId: string, segmentationRepresentation: ToolGroupSpecificRepresentation): void;
    getGlobalConfig(): SegmentationRepresentationConfig;
    setGlobalConfig(config: SegmentationRepresentationConfig): void;
    getSegmentationRepresentationByUID(toolGroupId: string, segmentationRepresentationUID: string): ToolGroupSpecificRepresentation | undefined;
    removeSegmentation(segmentationId: string): void;
    removeSegmentationRepresentation(toolGroupId: string, segmentationRepresentationUID: string): void;
    setActiveSegmentationRepresentation(toolGroupId: string, segmentationRepresentationUID: string): void;
    getToolGroupSpecificConfig(toolGroupId: string): SegmentationRepresentationConfig | undefined;
    getSegmentationRepresentationSpecificConfig(toolGroupId: string, segmentationRepresentationUID: string): RepresentationConfig;
    setSegmentationRepresentationSpecificConfig(toolGroupId: string, segmentationRepresentationUID: string, config: RepresentationConfig): void;
    getSegmentSpecificConfig(toolGroupId: string, segmentationRepresentationUID: string, segmentIndex: number): RepresentationConfig;
    setSegmentSpecificConfig(toolGroupId: string, segmentationRepresentationUID: string, config: SegmentSpecificRepresentationConfig, options?: {
        clear: false;
    }): void;
    setSegmentationRepresentationConfig(toolGroupId: string, config: SegmentationRepresentationConfig): void;
    addColorLUT(colorLUT: Types.ColorLUT, lutIndex: number): void;
    removeColorLUT(colorLUTIndex: number): void;
    _handleActiveSegmentation(toolGroupId: string, recentlyAddedOrRemovedSegmentationRepresentation: ToolGroupSpecificRepresentation): void;
}
declare const defaultSegmentationStateManager: SegmentationStateManager;
export { defaultSegmentationStateManager };
