"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConfigCache = exports.setConfigCache = exports.getConfigCache = void 0;
const configCachePerSegmentationRepresentationUID = new Map();
function getConfigCache(segmentationRepresentationUID) {
    return configCachePerSegmentationRepresentationUID.get(segmentationRepresentationUID);
}
exports.getConfigCache = getConfigCache;
function setConfigCache(segmentationRepresentationUID, config) {
    configCachePerSegmentationRepresentationUID.set(segmentationRepresentationUID, config);
}
exports.setConfigCache = setConfigCache;
function deleteConfigCache(segmentationRepresentationUID) {
    configCachePerSegmentationRepresentationUID.delete(segmentationRepresentationUID);
}
exports.deleteConfigCache = deleteConfigCache;
//# sourceMappingURL=contourConfigCache.js.map