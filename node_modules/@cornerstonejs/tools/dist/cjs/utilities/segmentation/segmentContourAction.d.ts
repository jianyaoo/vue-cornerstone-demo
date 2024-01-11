import { type Types } from '@cornerstonejs/core';
export declare type Segment = {
    segmentationId: string;
    segmentIndex: number;
    label: string;
    style?: any;
    containedSegmentIndices?: (number: any) => boolean;
};
export declare type SegmentContourActionConfiguration = {
    getSegment?: (enabledElement: Types.IEnabledElement, configuration: SegmentContourActionConfiguration) => Segment;
    segmentationId?: string;
    segmentIndex?: number;
    segmentData?: Map<number, Segment>;
    toolGroupId?: string;
};
export default function segmentContourAction(element: HTMLDivElement, configuration: any): any;
export declare function defaultGetSegment(enabledElement: Types.IEnabledElement, configuration: SegmentContourActionConfiguration): Segment;
