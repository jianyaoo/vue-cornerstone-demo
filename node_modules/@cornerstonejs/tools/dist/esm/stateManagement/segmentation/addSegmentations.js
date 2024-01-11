import _cloneDeep from 'lodash.clonedeep';
import { validateSegmentationInput } from './helpers';
import { addSegmentation as addSegmentationToState } from './segmentationState';
function addSegmentations(segmentationInputArray) {
    validateSegmentationInput(segmentationInputArray);
    segmentationInputArray.map((segInput) => {
        const segmentationInput = _cloneDeep(segInput);
        addSegmentationToState(segmentationInput);
    });
}
export default addSegmentations;
//# sourceMappingURL=addSegmentations.js.map