"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerSegmentationRemoved = exports.triggerSegmentationModified = exports.triggerSegmentationDataModified = exports.triggerSegmentationRepresentationRemoved = exports.triggerSegmentationRepresentationModified = void 0;
const core_1 = require("@cornerstonejs/core");
const enums_1 = require("../../enums");
const segmentationState_1 = require("../../stateManagement/segmentation/segmentationState");
function triggerSegmentationRemoved(segmentationId) {
    const eventDetail = {
        segmentationId,
    };
    (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.SEGMENTATION_REMOVED, eventDetail);
}
exports.triggerSegmentationRemoved = triggerSegmentationRemoved;
function triggerSegmentationRepresentationRemoved(toolGroupId, segmentationRepresentationUID) {
    const eventDetail = {
        toolGroupId,
        segmentationRepresentationUID,
    };
    (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.SEGMENTATION_REPRESENTATION_REMOVED, eventDetail);
}
exports.triggerSegmentationRepresentationRemoved = triggerSegmentationRepresentationRemoved;
function triggerSegmentationRepresentationModified(toolGroupId, segmentationRepresentationUID) {
    const eventDetail = {
        toolGroupId,
        segmentationRepresentationUID,
    };
    if (segmentationRepresentationUID) {
        (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.SEGMENTATION_REPRESENTATION_MODIFIED, eventDetail);
        return;
    }
    const segmentationRepresentations = (0, segmentationState_1.getSegmentationRepresentations)(toolGroupId) || [];
    segmentationRepresentations.forEach((segmentationRepresentation) => {
        const { segmentationRepresentationUID } = segmentationRepresentation;
        const eventDetail = {
            toolGroupId,
            segmentationRepresentationUID,
        };
        (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.SEGMENTATION_REPRESENTATION_MODIFIED, eventDetail);
    });
}
exports.triggerSegmentationRepresentationModified = triggerSegmentationRepresentationModified;
function triggerSegmentationModified(segmentationId) {
    let segmentationIds;
    if (segmentationId) {
        segmentationIds = [segmentationId];
    }
    else {
        segmentationIds = (0, segmentationState_1.getSegmentations)().map(({ segmentationId }) => segmentationId);
    }
    segmentationIds.forEach((segmentationId) => {
        const eventDetail = {
            segmentationId,
        };
        (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.SEGMENTATION_MODIFIED, eventDetail);
    });
}
exports.triggerSegmentationModified = triggerSegmentationModified;
function triggerSegmentationDataModified(segmentationId, modifiedSlicesToUse) {
    const eventDetail = {
        segmentationId,
        modifiedSlicesToUse,
    };
    (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.SEGMENTATION_DATA_MODIFIED, eventDetail);
}
exports.triggerSegmentationDataModified = triggerSegmentationDataModified;
//# sourceMappingURL=triggerSegmentationEvents.js.map