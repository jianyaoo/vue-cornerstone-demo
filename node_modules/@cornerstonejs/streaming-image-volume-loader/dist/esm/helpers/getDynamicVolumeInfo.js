import splitImageIdsBy4DTags from './splitImageIdsBy4DTags';
function getDynamicVolumeInfo(imageIds) {
    const timePoints = splitImageIdsBy4DTags(imageIds);
    const isDynamicVolume = timePoints.length > 1;
    return { isDynamicVolume, timePoints };
}
export default getDynamicVolumeInfo;
//# sourceMappingURL=getDynamicVolumeInfo.js.map