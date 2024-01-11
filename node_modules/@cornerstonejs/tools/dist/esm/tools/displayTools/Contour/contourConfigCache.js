const configCachePerSegmentationRepresentationUID = new Map();
export function getConfigCache(segmentationRepresentationUID) {
    return configCachePerSegmentationRepresentationUID.get(segmentationRepresentationUID);
}
export function setConfigCache(segmentationRepresentationUID, config) {
    configCachePerSegmentationRepresentationUID.set(segmentationRepresentationUID, config);
}
export function deleteConfigCache(segmentationRepresentationUID) {
    configCachePerSegmentationRepresentationUID.delete(segmentationRepresentationUID);
}
//# sourceMappingURL=contourConfigCache.js.map