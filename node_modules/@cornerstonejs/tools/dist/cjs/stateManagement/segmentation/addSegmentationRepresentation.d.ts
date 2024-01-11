import { SegmentationRepresentationConfig, RepresentationPublicInput } from '../../types/SegmentationStateTypes';
declare function addSegmentationRepresentation(toolGroupId: string, representationInput: RepresentationPublicInput, toolGroupSpecificConfig?: SegmentationRepresentationConfig): Promise<string>;
export { addSegmentationRepresentation };
