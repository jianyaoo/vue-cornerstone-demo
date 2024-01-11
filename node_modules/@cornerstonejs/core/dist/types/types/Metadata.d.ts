import type { VOI } from './voi';
declare type Metadata = {
    BitsAllocated: number;
    BitsStored: number;
    SamplesPerPixel: number;
    HighBit: number;
    PhotometricInterpretation: string;
    PixelRepresentation: number;
    Modality: string;
    SeriesInstanceUID?: string;
    ImageOrientationPatient: Array<number>;
    PixelSpacing: Array<number>;
    FrameOfReferenceUID: string;
    Columns: number;
    Rows: number;
    voiLut: Array<VOI>;
    VOILUTFunction: string;
};
export default Metadata;
//# sourceMappingURL=Metadata.d.ts.map