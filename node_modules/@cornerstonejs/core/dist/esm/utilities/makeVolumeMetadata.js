import { metaData } from '../';
export default function makeVolumeMetadata(imageIds) {
    const imageId0 = imageIds[0];
    const { pixelRepresentation, bitsAllocated, bitsStored, highBit, photometricInterpretation, samplesPerPixel, } = metaData.get('imagePixelModule', imageId0);
    const voiLut = [];
    const voiLutModule = metaData.get('voiLutModule', imageId0);
    let voiLUTFunction;
    if (voiLutModule) {
        const { windowWidth, windowCenter } = voiLutModule;
        voiLUTFunction = voiLutModule?.voiLUTFunction;
        if (Array.isArray(windowWidth)) {
            for (let i = 0; i < windowWidth.length; i++) {
                voiLut.push({
                    windowWidth: windowWidth[i],
                    windowCenter: windowCenter[i],
                });
            }
        }
        else {
            voiLut.push({
                windowWidth: windowWidth,
                windowCenter: windowCenter,
            });
        }
    }
    else {
        voiLut.push({
            windowWidth: undefined,
            windowCenter: undefined,
        });
    }
    const { modality, seriesInstanceUID } = metaData.get('generalSeriesModule', imageId0);
    const { imageOrientationPatient, pixelSpacing, frameOfReferenceUID, columns, rows, } = metaData.get('imagePlaneModule', imageId0);
    return {
        BitsAllocated: bitsAllocated,
        BitsStored: bitsStored,
        SamplesPerPixel: samplesPerPixel,
        HighBit: highBit,
        PhotometricInterpretation: photometricInterpretation,
        PixelRepresentation: pixelRepresentation,
        Modality: modality,
        ImageOrientationPatient: imageOrientationPatient,
        PixelSpacing: pixelSpacing,
        FrameOfReferenceUID: frameOfReferenceUID,
        Columns: columns,
        Rows: rows,
        voiLut,
        VOILUTFunction: voiLUTFunction,
        SeriesInstanceUID: seriesInstanceUID,
    };
}
//# sourceMappingURL=makeVolumeMetadata.js.map