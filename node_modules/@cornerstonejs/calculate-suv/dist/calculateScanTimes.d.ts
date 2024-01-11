import { FullDateInterface } from './combineDateTime';
/**
 * Javascript object with scan properties
 *
 * @interface InstanceMetadataForScanTimes
 */
interface InstanceMetadataForScanTimes {
    SeriesDate: string;
    SeriesTime: string;
    AcquisitionDate: string;
    AcquisitionTime: string;
    GEPrivatePostInjectionDateTime?: string;
    RadionuclideHalfLife?: number;
    RadionuclideTotalDose?: number;
    FrameReferenceTime?: number;
    ActualFrameDuration?: number;
}
/**
 * Calculate the scan times
 *
 * @export
 * @param {InstanceMetadataForScanTimes[]} instances
 * @returns {FullDateInterface[]}
 */
export default function calculateScanTimes(instances: InstanceMetadataForScanTimes[]): FullDateInterface[];
export { calculateScanTimes };
