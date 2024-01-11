"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidVolume = void 0;
const __1 = require("..");
const isEqual_1 = __importDefault(require("./isEqual"));
function isValidVolume(imageIds) {
    const imageId0 = imageIds[0];
    const { modality, seriesInstanceUID } = __1.metaData.get('generalSeriesModule', imageId0);
    const { imageOrientationPatient, pixelSpacing, frameOfReferenceUID, columns, rows, } = __1.metaData.get('imagePlaneModule', imageId0);
    const baseMetadata = {
        modality,
        imageOrientationPatient,
        pixelSpacing,
        frameOfReferenceUID,
        columns,
        rows,
        seriesInstanceUID,
    };
    const validVolume = imageIds.every((imageId) => {
        const { modality, seriesInstanceUID } = __1.metaData.get('generalSeriesModule', imageId);
        const { imageOrientationPatient, pixelSpacing, columns, rows } = __1.metaData.get('imagePlaneModule', imageId);
        return (seriesInstanceUID === baseMetadata.seriesInstanceUID &&
            modality === baseMetadata.modality &&
            columns === baseMetadata.columns &&
            rows === baseMetadata.rows &&
            (0, isEqual_1.default)(imageOrientationPatient, baseMetadata.imageOrientationPatient) &&
            (0, isEqual_1.default)(pixelSpacing, baseMetadata.pixelSpacing));
    });
    return validVolume;
}
exports.isValidVolume = isValidVolume;
//# sourceMappingURL=isValidVolume.js.map