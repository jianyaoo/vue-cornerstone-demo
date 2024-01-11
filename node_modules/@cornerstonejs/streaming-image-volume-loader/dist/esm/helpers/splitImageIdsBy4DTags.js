import { metaData } from '@cornerstonejs/core';
const groupBy = (array, key) => {
    return array.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
function splitFramesByFrameReferenceTime(imageIds) {
    const framesMetadata = imageIds.map((imageId) => {
        const petImageModule = metaData.get('petImageModule', imageId);
        const { frameReferenceTime = 0 } = petImageModule ?? {};
        return { imageId, frameReferenceTime };
    });
    const framesGroups = groupBy(framesMetadata, 'frameReferenceTime');
    const sortedFrameReferenceTimes = Object.keys(framesGroups)
        .map(Number.parseFloat)
        .sort((a, b) => a - b);
    const imageIdsGroups = sortedFrameReferenceTimes.map((key) => framesGroups[key].map((item) => item.imageId));
    return imageIdsGroups;
}
function splitImageIdsBy4DTags(imageIds) {
    const fncList = [splitFramesByFrameReferenceTime];
    for (let i = 0; i < fncList.length; i++) {
        const framesGroups = fncList[i](imageIds);
        if (!framesGroups || framesGroups.length <= 1) {
            continue;
        }
        const framesPerGroup = framesGroups[0].length;
        const groupsHaveSameLength = framesGroups.every((g) => g.length === framesPerGroup);
        if (groupsHaveSameLength) {
            return framesGroups;
        }
    }
    return [imageIds];
}
export default splitImageIdsBy4DTags;
//# sourceMappingURL=splitImageIdsBy4DTags.js.map