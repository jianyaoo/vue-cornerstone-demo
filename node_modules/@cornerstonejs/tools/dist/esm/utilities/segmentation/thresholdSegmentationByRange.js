import { pointInShapeCallback } from '../../utilities';
import { triggerSegmentationDataModified } from '../../stateManagement/segmentation/triggerSegmentationEvents';
import { getVoxelOverlap, processVolumes, } from './utilities';
function thresholdSegmentationByRange(segmentationVolume, segmentationIndex, thresholdVolumeInformation, overlapType) {
    const scalarData = segmentationVolume.getScalarData();
    const { baseVolumeIdx, volumeInfoList } = processVolumes(segmentationVolume, thresholdVolumeInformation);
    volumeInfoList.forEach((volumeInfo) => {
        const { volumeSize } = volumeInfo;
        if (volumeSize === scalarData.length) {
            _handleSameSizeVolume(scalarData, segmentationIndex, volumeInfo);
        }
        else {
            _handleDifferentSizeVolume(scalarData, segmentationIndex, volumeInfo, volumeInfoList, baseVolumeIdx, overlapType);
        }
    });
    triggerSegmentationDataModified(segmentationVolume.volumeId);
    return segmentationVolume;
}
function _handleDifferentSizeVolume(scalarData, segmentationIndex, volumeInfo, volumeInfoList, baseVolumeIdx, overlapType) {
    const { imageData, lower, upper, dimensions } = volumeInfo;
    let total, overlaps, range;
    for (let i = 0; i < scalarData.length; i++) {
        if (scalarData[i] === segmentationIndex) {
            const overlapBounds = getVoxelOverlap(imageData, dimensions, volumeInfoList[baseVolumeIdx].spacing, volumeInfoList[baseVolumeIdx].imageData.getPoint(i));
            const callbackOverlap = ({ value }) => {
                total = total + 1;
                if (value >= range.lower && value <= range.upper) {
                    overlaps = overlaps + 1;
                }
            };
            total = 0;
            overlaps = 0;
            range = { lower, upper };
            let overlapTest = false;
            pointInShapeCallback(imageData, () => true, callbackOverlap, overlapBounds);
            overlapTest = overlapType === 0 ? overlaps > 0 : overlaps === total;
            scalarData[i] = overlapTest ? segmentationIndex : 0;
        }
    }
    return { total, range, overlaps };
}
function _handleSameSizeVolume(scalarData, segmentationIndex, volumeInfo) {
    const { referenceValues, lower, upper } = volumeInfo;
    for (let i = 0; i < scalarData.length; i++) {
        if (scalarData[i] === segmentationIndex) {
            const value = referenceValues[i];
            scalarData[i] = value >= lower && value <= upper ? segmentationIndex : 0;
        }
    }
}
export default thresholdSegmentationByRange;
//# sourceMappingURL=thresholdSegmentationByRange.js.map