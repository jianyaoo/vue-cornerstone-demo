declare class AnnotationToPointData {
    static TOOL_NAMES: Record<string, any>;
    constructor();
    static convert(annotation: any, index: any, metadataProvider: any): {
        ReferencedROINumber: any;
        ROIDisplayColor: number[];
        ContourSequence: any;
    };
    static register(toolClass: any): void;
}
export default AnnotationToPointData;
