"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const segmentationState_1 = require("../../stateManagement/segmentation/segmentationState");
const triggerSegmentationEvents_1 = require("../../stateManagement/segmentation/triggerSegmentationEvents");
const segmentationModifiedListener = function (evt) {
    const { segmentationId } = evt.detail;
    const toolGroupIds = (0, segmentationState_1.getToolGroupIdsWithSegmentation)(segmentationId);
    toolGroupIds.forEach((toolGroupId) => {
        const segRepresentations = (0, segmentationState_1.getSegmentationRepresentations)(toolGroupId);
        segRepresentations.forEach((representation) => {
            if (representation.segmentationId === segmentationId) {
                (0, triggerSegmentationEvents_1.triggerSegmentationRepresentationModified)(toolGroupId, representation.segmentationRepresentationUID);
            }
        });
    });
};
exports.default = segmentationModifiedListener;
//# sourceMappingURL=segmentationModifiedEventListener.js.map