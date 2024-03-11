export declare function computeStackSegmentationFromVolume({ volumeId, }: {
    volumeId: string;
}): Promise<{
    imageIdReferenceMap: Map<string, string>;
}>;
export declare function convertVolumeToStackSegmentation({ segmentationId, options, }: {
    segmentationId: string;
    options?: {
        toolGroupId: string;
        newSegmentationId?: string;
        removeOriginal?: boolean;
    };
}): Promise<void>;
export declare function updateStackSegmentationState({ segmentationId, toolGroupId, imageIdReferenceMap, options, }: {
    segmentationId: string;
    toolGroupId: string;
    imageIdReferenceMap: Map<any, any>;
    options?: {
        removeOriginal?: boolean;
    };
}): Promise<void>;
