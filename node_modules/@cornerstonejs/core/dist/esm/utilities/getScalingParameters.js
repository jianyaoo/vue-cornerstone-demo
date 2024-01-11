import { get as metaDataGet } from '../metaData';
export default function getScalingParameters(imageId) {
    const modalityLutModule = metaDataGet('modalityLutModule', imageId) || {};
    const generalSeriesModule = metaDataGet('generalSeriesModule', imageId) || {};
    const { modality } = generalSeriesModule;
    const scalingParameters = {
        rescaleSlope: modalityLutModule.rescaleSlope,
        rescaleIntercept: modalityLutModule.rescaleIntercept,
        modality,
    };
    const suvFactor = metaDataGet('scalingModule', imageId) || {};
    return {
        ...scalingParameters,
        ...(modality === 'PT' && {
            suvbw: suvFactor.suvbw,
            suvbsa: suvFactor.suvbsa,
            suvlbm: suvFactor.suvlbm,
        }),
    };
}
//# sourceMappingURL=getScalingParameters.js.map