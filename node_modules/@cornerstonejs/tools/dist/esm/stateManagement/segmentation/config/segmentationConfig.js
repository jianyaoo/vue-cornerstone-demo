import * as SegmentationState from '../../../stateManagement/segmentation/segmentationState';
function getGlobalConfig() {
    return SegmentationState.getGlobalConfig();
}
function setGlobalConfig(segmentationConfig) {
    SegmentationState.setGlobalConfig(segmentationConfig);
}
function getGlobalRepresentationConfig(representationType) {
    const globalConfig = getGlobalConfig();
    return globalConfig.representations[representationType];
}
function setGlobalRepresentationConfig(representationType, config) {
    const globalConfig = getGlobalConfig();
    setGlobalConfig({
        ...globalConfig,
        representations: {
            ...globalConfig.representations,
            [representationType]: {
                ...globalConfig.representations[representationType],
                ...config,
            },
        },
    });
}
function getToolGroupSpecificConfig(toolGroupId) {
    return SegmentationState.getToolGroupSpecificConfig(toolGroupId);
}
function setToolGroupSpecificConfig(toolGroupId, segmentationRepresentationConfig) {
    SegmentationState.setToolGroupSpecificConfig(toolGroupId, segmentationRepresentationConfig);
}
function getSegmentationRepresentationSpecificConfig(toolGroupId, segmentationRepresentationUID) {
    return SegmentationState.getSegmentationRepresentationSpecificConfig(toolGroupId, segmentationRepresentationUID);
}
function setSegmentationRepresentationSpecificConfig(toolGroupId, segmentationRepresentationUID, config) {
    SegmentationState.setSegmentationRepresentationSpecificConfig(toolGroupId, segmentationRepresentationUID, config);
}
function getSegmentSpecificConfig(toolGroupId, segmentationRepresentationUID, segmentIndex) {
    return SegmentationState.getSegmentSpecificRepresentationConfig(toolGroupId, segmentationRepresentationUID, segmentIndex);
}
function setSegmentSpecificConfig(toolGroupId, segmentationRepresentationUID, config) {
    SegmentationState.setSegmentSpecificRepresentationConfig(toolGroupId, segmentationRepresentationUID, config);
}
export { getGlobalConfig, setGlobalConfig, getGlobalRepresentationConfig, setGlobalRepresentationConfig, getToolGroupSpecificConfig, setToolGroupSpecificConfig, getSegmentationRepresentationSpecificConfig, setSegmentationRepresentationSpecificConfig, getSegmentSpecificConfig, setSegmentSpecificConfig, };
//# sourceMappingURL=segmentationConfig.js.map