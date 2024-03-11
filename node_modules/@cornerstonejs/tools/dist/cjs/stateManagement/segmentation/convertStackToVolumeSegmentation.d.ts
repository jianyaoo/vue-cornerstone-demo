declare function computeVolumeSegmentationFromStack({ imageIdReferenceMap, options, }: {
    imageIdReferenceMap: Map<string, string>;
    options?: {
        volumeId?: string;
    };
}): Promise<{
    volumeId: string;
}>;
declare function convertStackToVolumeSegmentation({ segmentationId, options, }: {
    segmentationId: string;
    options?: {
        toolGroupId: string;
        volumeId?: string;
        removeOriginal?: boolean;
    };
}): Promise<void>;
export { convertStackToVolumeSegmentation, computeVolumeSegmentationFromStack };
