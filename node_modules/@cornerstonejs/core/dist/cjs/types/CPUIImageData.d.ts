import type { Point3, Scaling, Mat3, PixelDataTypedArray } from '../types';
import IImageCalibration from './IImageCalibration';
declare type CPUImageData = {
    worldToIndex?: (point: Point3) => Point3;
    indexToWorld?: (point: Point3) => Point3;
    getWorldToIndex?: () => Point3;
    getIndexToWorld?: () => Point3;
    getSpacing?: () => Point3;
    getDirection?: () => Mat3;
    getScalarData?: () => PixelDataTypedArray;
    getDimensions?: () => Point3;
};
declare type CPUIImageData = {
    dimensions: Point3;
    direction: Mat3;
    spacing: Point3;
    origin: Point3;
    imageData: CPUImageData;
    metadata: {
        Modality: string;
    };
    scalarData: PixelDataTypedArray;
    scaling: Scaling;
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
};
export default CPUIImageData;
export { CPUImageData };
