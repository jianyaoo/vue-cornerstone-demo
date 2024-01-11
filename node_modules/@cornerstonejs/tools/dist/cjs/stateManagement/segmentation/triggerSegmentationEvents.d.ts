declare function triggerSegmentationRemoved(segmentationId: string): void;
declare function triggerSegmentationRepresentationRemoved(toolGroupId: string, segmentationRepresentationUID: string): void;
declare function triggerSegmentationRepresentationModified(toolGroupId: string, segmentationRepresentationUID?: string): void;
declare function triggerSegmentationModified(segmentationId?: string): void;
declare function triggerSegmentationDataModified(segmentationId: string, modifiedSlicesToUse?: number[]): void;
export { triggerSegmentationRepresentationModified, triggerSegmentationRepresentationRemoved, triggerSegmentationDataModified, triggerSegmentationModified, triggerSegmentationRemoved, };
