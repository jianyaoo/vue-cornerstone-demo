import { getToolGroupIdsWithSegmentation, getSegmentationRepresentations, } from '../../stateManagement/segmentation/segmentationState';
import { triggerSegmentationRepresentationModified } from '../../stateManagement/segmentation/triggerSegmentationEvents';
const segmentationModifiedListener = function (evt) {
    const { segmentationId } = evt.detail;
    const toolGroupIds = getToolGroupIdsWithSegmentation(segmentationId);
    toolGroupIds.forEach((toolGroupId) => {
        const segRepresentations = getSegmentationRepresentations(toolGroupId);
        segRepresentations.forEach((representation) => {
            if (representation.segmentationId === segmentationId) {
                triggerSegmentationRepresentationModified(toolGroupId, representation.segmentationRepresentationUID);
            }
        });
    });
};
export default segmentationModifiedListener;
//# sourceMappingURL=segmentationModifiedEventListener.js.map