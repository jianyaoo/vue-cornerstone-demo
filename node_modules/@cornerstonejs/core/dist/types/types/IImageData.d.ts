import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import { Point3, Scaling, Mat3 } from '../types';
import IImageCalibration from './IImageCalibration';
interface IImageData {
    dimensions: Point3;
    direction: Mat3;
    spacing: Point3;
    origin: Point3;
    scalarData: Float32Array | Uint16Array | Uint8Array | Int16Array;
    imageData: vtkImageData;
    metadata: {
        Modality: string;
    };
    scaling?: Scaling;
    hasPixelSpacing?: boolean;
    calibration?: IImageCalibration;
    preScale?: {
        scaled?: boolean;
        scalingParameters?: {
            modality?: string;
            rescaleSlope?: number;
            rescaleIntercept?: number;
            suvbw?: number;
        };
    };
}
export default IImageData;
//# sourceMappingURL=IImageData.d.ts.map