import { getSegmentation } from '../../stateManagement/segmentation/segmentationState';
import { triggerSegmentationModified } from './triggerSegmentationEvents';
function isSegmentIndexLocked(segmentationId, segmentIndex) {
    const segmentation = getSegmentation(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segmentsLocked } = segmentation;
    return segmentsLocked.has(segmentIndex);
}
function setSegmentIndexLocked(segmentationId, segmentIndex, locked = true) {
    const segmentation = getSegmentation(segmentationId);
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
    triggerSegmentationModified(segmentationId);
}
function getLockedSegments(segmentationId) {
    const segmentation = getSegmentation(segmentationId);
    if (!segmentation) {
        throw new Error(`No segmentation state found for ${segmentationId}`);
    }
    const { segmentsLocked } = segmentation;
    return Array.from(segmentsLocked);
}
export { isSegmentIndexLocked, setSegmentIndexLocked, getLockedSegments };
//# sourceMappingURL=segmentLocking.js.map