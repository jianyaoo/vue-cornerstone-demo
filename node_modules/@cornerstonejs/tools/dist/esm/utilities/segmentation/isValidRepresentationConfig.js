import { isValidLabelmapConfig } from '../../tools/displayTools/Labelmap/labelmapConfig';
import SegmentationRepresentation from '../../enums/SegmentationRepresentations';
export default function isValidRepresentationConfig(representationType, config) {
    switch (representationType) {
        case SegmentationRepresentation.Labelmap:
            return isValidLabelmapConfig(config);
        default:
            throw new Error(`Unknown representation type: ${representationType}`);
    }
}
//# sourceMappingURL=isValidRepresentationConfig.js.map