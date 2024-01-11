"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../utilities");
const triggerSegmentationEvents_1 = require("../../stateManagement/segmentation/triggerSegmentationEvents");
const utilities_2 = require("./utilities");
function thresholdSegmentationByRange(segmentationVolume, segmentationIndex, thresholdVolumeInformation, overlapType) {
    const scalarData = segmentationVolume.getScalarData();
    const { baseVolumeIdx, volumeInfoList } = (0, utilities_2.processVolumes)(segmentationVolume, thresholdVolumeInformation);
    volumeInfoList.forEach((volumeInfo) => {
        const { volumeSize } = volumeInfo;
        if (volumeSize === scalarData.length) {
            _handleSameSizeVolume(scalarData, segmentationIndex, volumeInfo);
        }
        else {
            _handleDifferentSizeVolume(scalarData, segmentationIndex, volumeInfo, volumeInfoList, baseVolumeIdx, overlapType);
        }
    });
    (0, triggerSegmentationEvents_1.triggerSegmentationDataModified)(segmentationVolume.volumeId);
    return segmentationVolume;
}
function _handleDifferentSizeVolume(scalarData, segmentationIndex, volumeInfo, volumeInfoList, baseVolumeIdx, overlapType) {
    const { imageData, lower, upper, dimensions } = volumeInfo;
    let total, overlaps, range;
    for (let i = 0; i < scalarData.length; i++) {
        if (scalarData[i] === segmentationIndex) {
            const overlapBounds = (0, utilities_2.getVoxelOverlap)(imageData, dimensions, volumeInfoList[baseVolumeIdx].spacing, volumeInfoList[baseVolumeIdx].imageData.getPoint(i));
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
            (0, utilities_1.pointInShapeCallback)(imageData, () => true, callbackOverlap, overlapBounds);
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
exports.default = thresholdSegmentationByRange;
//# sourceMappingURL=thresholdSegmentationByRange.js.map