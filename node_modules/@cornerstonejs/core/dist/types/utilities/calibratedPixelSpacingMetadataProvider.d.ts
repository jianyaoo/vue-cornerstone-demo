import { IImageCalibration } from '../types';
declare const metadataProvider: {
    add: (imageId: string, payload: IImageCalibration) => void;
    get: (type: string, imageId: string) => IImageCalibration;
};
export default metadataProvider;
//# sourceMappingURL=calibratedPixelSpacingMetadataProvider.d.ts.map