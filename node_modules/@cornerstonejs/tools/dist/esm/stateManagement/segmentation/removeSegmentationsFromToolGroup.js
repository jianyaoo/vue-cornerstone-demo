import SegmentationRepresentations from '../../enums/SegmentationRepresentations';
import { labelmapDisplay } from '../../tools/displayTools/Labelmap';
import { contourDisplay } from '../../tools/displayTools/Contour';
import { getSegmentationRepresentations, getSegmentationRepresentationByUID, } from './segmentationState';
function removeSegmentationsFromToolGroup(toolGroupId, segmentationRepresentationUIDs, immediate) {
    const toolGroupSegRepresentations = getSegmentationRepresentations(toolGroupId);
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
    const segmentationRepresentation = getSegmentationRepresentationByUID(toolGroupId, segmentationRepresentationUID);
    const { type } = segmentationRepresentation;
    if (type === SegmentationRepresentations.Labelmap) {
        labelmapDisplay.removeSegmentationRepresentation(toolGroupId, segmentationRepresentationUID, immediate);
    }
    else if (type === SegmentationRepresentations.Contour) {
        contourDisplay.removeSegmentationRepresentation(toolGroupId, segmentationRepresentationUID, immediate);
    }
    else {
        throw new Error(`The representation ${type} is not supported yet`);
    }
}
export default removeSegmentationsFromToolGroup;
//# sourceMappingURL=removeSegmentationsFromToolGroup.js.map