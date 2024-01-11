"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockedSegments = exports.setSegmentIndexLocked = exports.isSegmentIndexLocked = void 0;
const segmentationState_1 = require("../../stateManagement/segmentation/segmentationState");
const triggerSegmentationEvents_1 = require("./triggerSegmentationEvents");
function isSegmentIndexLocked(segmentationId, segmentIndex) {
    const segmentation = (0, segmentationState_1.getSegmentation)(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segmentsLocked } = segmentation;
    return segmentsLocked.has(segmentIndex);
}
exports.isSegmentIndexLocked = isSegmentIndexLocked;
function setSegmentIndexLocked(segmentationId, segmentIndex, locked = true) {
    const segmentation = (0, segmentationState_1.getSegmentation)(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segmentsLocked } = segmentation;
    if (locked) {
        segmentsLocked.add(segmentIndex);
    }
    else {
        segmentsLocked.delete(segmentIndex);
    }
    (0, triggerSegmentationEvents_1.triggerSegmentationModified)(segmentationId);
}
exports.setSegmentIndexLocked = setSegmentIndexLocked;
function getLockedSegments(segmentationId) {
    const segmentation = (0, segmentationState_1.getSegmentation)(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segmentsLocked } = segmentation;
    return Array.from(segmentsLocked);
}
exports.getLockedSegments = getLockedSegments;
//# sourceMappingURL=segmentLocking.js.map