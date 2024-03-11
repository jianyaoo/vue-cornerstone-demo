declare function getStrategyData({ operationData, viewport }: {
    operationData: any;
    viewport: any;
}): {
    segmentationImageData: any;
    segmentationScalarData: any;
    segmentationVoxelManager: any;
    imageScalarData: any;
    imageVoxelManager: any;
};
export { getStrategyData };
