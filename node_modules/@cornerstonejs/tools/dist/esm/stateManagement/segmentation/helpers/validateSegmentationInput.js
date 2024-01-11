import * as Enums from '../../../enums';
import validateLabelmap from '../../../tools/displayTools/Labelmap/validateRepresentationData';
function validateSegmentationInput(segmentationInputArray) {
    if (!segmentationInputArray || !segmentationInputArray.length) {
        throw new Error('The segmentationInputArray is undefined or empty array');
    }
    segmentationInputArray.forEach((segmentationInput) => {
        if (segmentationInput.segmentationId === undefined) {
            throw new Error('The segmentationInput.segmentationId is undefined, please provide a valid segmentationId');
        }
        if (segmentationInput.representation === undefined) {
            throw new Error('The segmentationInput.representation is undefined, please provide a valid representation');
        }
        if (segmentationInput.representation.type ===
            Enums.SegmentationRepresentations.Labelmap) {
            validateLabelmap(segmentationInput);
        }
    });
}
export default validateSegmentationInput;
//# sourceMappingURL=validateSegmentationInput.js.map