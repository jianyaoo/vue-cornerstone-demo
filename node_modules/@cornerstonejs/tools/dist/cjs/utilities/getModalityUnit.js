"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModalityUnit = void 0;
const core_1 = require("@cornerstonejs/core");
function getModalityUnit(modality, imageId, options) {
    if (modality === 'CT') {
        return 'HU';
    }
    else if (modality === 'PT') {
        return _handlePTModality(imageId, options);
    }
    else {
        return '';
    }
}
exports.getModalityUnit = getModalityUnit;
function _handlePTModality(imageId, options) {
    if (!options.isPreScaled) {
        return 'raw';
    }
    if (options.isSuvScaled) {
        return 'SUV';
    }
    const generalSeriesModule = core_1.metaData.get('generalSeriesModule', imageId);
    if ((generalSeriesModule === null || generalSeriesModule === void 0 ? void 0 : generalSeriesModule.modality) === 'PT') {
        const petSeriesModule = core_1.metaData.get('petSeriesModule', imageId);
        return (petSeriesModule === null || petSeriesModule === void 0 ? void 0 : petSeriesModule.units) || 'unitless';
    }
}
//# sourceMappingURL=getModalityUnit.js.map