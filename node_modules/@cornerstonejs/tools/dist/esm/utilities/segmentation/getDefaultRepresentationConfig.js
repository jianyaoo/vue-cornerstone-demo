import getDefaultLabelmapConfig from '../../tools/displayTools/Labelmap/labelmapConfig';
import SegmentationRepresentation from '../../enums/SegmentationRepresentations';
export default function getDefaultRepresentationConfig(segmentation) {
    const { type: representationType } = segmentation;
    switch (representationType) {
        case SegmentationRepresentation.Labelmap:
            return getDefaultLabelmapConfig();
        default:
            throw new Error(`Unknown representation type: ${representationType}`);
    }
}
//# sourceMappingURL=getDefaultRepresentationConfig.js.map