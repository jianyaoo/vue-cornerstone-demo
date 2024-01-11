"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
function makeVolumeMetadata(imageIds) {
    const imageId0 = imageIds[0];
    const { pixelRepresentation, bitsAllocated, bitsStored, highBit, photometricInterpretation, samplesPerPixel, } = __1.metaData.get('imagePixelModule', imageId0);
    const voiLut = [];
    const voiLutModule = __1.metaData.get('voiLutModule', imageId0);
    let voiLUTFunction;
    if (voiLutModule) {
        const { windowWidth, windowCenter } = voiLutModule;
        voiLUTFunction = voiLutModule === null || voiLutModule === void 0 ? void 0 : voiLutModule.voiLUTFunction;
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
    const { modality, seriesInstanceUID } = __1.metaData.get('generalSeriesModule', imageId0);
    const { imageOrientationPatient, pixelSpacing, frameOfReferenceUID, columns, rows, } = __1.metaData.get('imagePlaneModule', imageId0);
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
exports.default = makeVolumeMetadata;
//# sourceMappingURL=makeVolumeMetadata.js.map