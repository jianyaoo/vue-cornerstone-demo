import { triggerEvent, eventTarget } from '@cornerstonejs/core';
import { Events } from '../../enums';
import { getSegmentationRepresentations, getSegmentations, } from '../../stateManagement/segmentation/segmentationState';
function triggerSegmentationRemoved(segmentationId) {
    const eventDetail = {
        segmentationId,
    };
    triggerEvent(eventTarget, Events.SEGMENTATION_REMOVED, eventDetail);
}
function triggerSegmentationRepresentationRemoved(toolGroupId, segmentationRepresentationUID) {
    const eventDetail = {
        toolGroupId,
        segmentationRepresentationUID,
    };
    triggerEvent(eventTarget, Events.SEGMENTATION_REPRESENTATION_REMOVED, eventDetail);
}
function triggerSegmentationRepresentationModified(toolGroupId, segmentationRepresentationUID) {
    const eventDetail = {
        toolGroupId,
        segmentationRepresentationUID,
    };
    if (segmentationRepresentationUID) {
        triggerEvent(eventTarget, Events.SEGMENTATION_REPRESENTATION_MODIFIED, eventDetail);
        return;
    }
    const segmentationRepresentations = getSegmentationRepresentations(toolGroupId) || [];
    segmentationRepresentations.forEach((segmentationRepresentation) => {
        const { segmentationRepresentationUID } = segmentationRepresentation;
        const eventDetail = {
            toolGroupId,
            segmentationRepresentationUID,
        };
        triggerEvent(eventTarget, Events.SEGMENTATION_REPRESENTATION_MODIFIED, eventDetail);
    });
}
function triggerSegmentationModified(segmentationId) {
    let segmentationIds;
    if (segmentationId) {
        segmentationIds = [segmentationId];
    }
    else {
        segmentationIds = getSegmentations().map(({ segmentationId }) => segmentationId);
    }
    segmentationIds.forEach((segmentationId) => {
        const eventDetail = {
            segmentationId,
        };
        triggerEvent(eventTarget, Events.SEGMENTATION_MODIFIED, eventDetail);
    });
}
function triggerSegmentationDataModified(segmentationId, modifiedSlicesToUse) {
    const eventDetail = {
        segmentationId,
        modifiedSlicesToUse,
    };
    triggerEvent(eventTarget, Events.SEGMENTATION_DATA_MODIFIED, eventDetail);
}
export { triggerSegmentationRepresentationModified, triggerSegmentationRepresentationRemoved, triggerSegmentationDataModified, triggerSegmentationModified, triggerSegmentationRemoved, };
//# sourceMappingURL=triggerSegmentationEvents.js.map