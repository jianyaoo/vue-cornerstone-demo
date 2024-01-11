import { SegmentationRepresentationConfig, RepresentationPublicInput } from '../../types/SegmentationStateTypes';
declare function addSegmentationRepresentations(toolGroupId: string, representationInputArray: RepresentationPublicInput[], toolGroupSpecificRepresentationConfig?: SegmentationRepresentationConfig): Promise<string[]>;
export default addSegmentationRepresentations;
