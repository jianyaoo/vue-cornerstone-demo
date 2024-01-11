"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SegmentationRepresentations_1 = __importDefault(require("../../enums/SegmentationRepresentations"));
const Labelmap_1 = require("../../tools/displayTools/Labelmap");
const Contour_1 = require("../../tools/displayTools/Contour");
const segmentationState_1 = require("./segmentationState");
function removeSegmentationsFromToolGroup(toolGroupId, segmentationRepresentationUIDs, immediate) {
    const toolGroupSegRepresentations = (0, segmentationState_1.getSegmentationRepresentations)(toolGroupId);
    if (!toolGroupSegRepresentations ||
        toolGroupSegRepresentations.length === 0) {
        return;
    }
    const toolGroupSegRepresentationUIDs = toolGroupSegRepresentations.map((representation) => representation.segmentationRepresentationUID);
    let segRepresentationUIDsToRemove = segmentationRepresentationUIDs;
    if (segRepresentationUIDsToRemove) {
        const invalidSegRepresentationUIDs = segmentationRepresentationUIDs.filter((segRepresentationUID) => !toolGroupSegRepresentationUIDs.includes(segRepresentationUID));
        if (invalidSegRepresentationUIDs.length > 0) {
            throw new Error(`The following segmentationRepresentationUIDs are not part of the toolGroup: ${JSON.stringify(invalidSegRepresentationUIDs)}`);
        }
    }
    else {
        segRepresentationUIDsToRemove = toolGroupSegRepresentationUIDs;
    }
    segRepresentationUIDsToRemove.forEach((segmentationDataUID) => {
        _removeSegmentation(toolGroupId, segmentationDataUID, immediate);
    });
}
function _removeSegmentation(toolGroupId, segmentationRepresentationUID, immediate) {
    const segmentationRepresentation = (0, segmentationState_1.getSegmentationRepresentationByUID)(toolGroupId, segmentationRepresentationUID);
    const { type } = segmentationRepresentation;
    if (type === SegmentationRepresentations_1.default.Labelmap) {
        Labelmap_1.labelmapDisplay.removeSegmentationRepresentation(toolGroupId, segmentationRepresentationUID, immediate);
    }
    else if (type === SegmentationRepresentations_1.default.Contour) {
        Contour_1.contourDisplay.removeSegmentationRepresentation(toolGroupId, segmentationRepresentationUID, immediate);
    }
    else {
        throw new Error(`The representation ${type} is not supported yet`);
    }
}
exports.default = removeSegmentationsFromToolGroup;
//# sourceMappingURL=removeSegmentationsFromToolGroup.js.map