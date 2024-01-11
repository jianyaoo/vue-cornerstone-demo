import { Annotation } from '../types';
export declare type FramesRange = [number, number] | number;
export default class AnnotationFrameRange {
    protected static frameRangeExtractor: RegExp;
    protected static imageIdToFrames(imageId: string): FramesRange;
    static framesToString(range: any): string;
    protected static framesToImageId(imageId: string, range: FramesRange | string): string;
    static setFrameRange(annotation: Annotation, range: FramesRange | string, eventBase?: {
        viewportId: any;
        renderingEngineId: any;
    }): void;
    static getFrameRange(annotation: Annotation): number | [number, number];
}
