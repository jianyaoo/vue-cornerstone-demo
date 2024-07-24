"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metaData_1 = require("../metaData");
function getScalingParameters(imageId) {
    var _a;
    const modalityLutModule = (0, metaData_1.get)('modalityLutModule', imageId) || {};
    const generalSeriesModule = (0, metaData_1.get)('generalSeriesModule', imageId) || {};
    const { modality } = generalSeriesModule;
    const scalingParameters = {
        rescaleSlope: modalityLutModule.rescaleSlope || 1,
        rescaleIntercept: (_a = modalityLutModule.rescaleIntercept) !== null && _a !== void 0 ? _a : 0,
        modality,
    };
    const suvFactor = (0, metaData_1.get)('scalingModule', imageId) || {};
    return Object.assign(Object.assign({}, scalingParameters), (modality === 'PT' && {
        suvbw: suvFactor.suvbw,
        suvbsa: suvFactor.suvbsa,
        suvlbm: suvFactor.suvlbm,
    }));
}
exports.default = getScalingParameters;
//# sourceMappingURL=getScalingParameters.js.map