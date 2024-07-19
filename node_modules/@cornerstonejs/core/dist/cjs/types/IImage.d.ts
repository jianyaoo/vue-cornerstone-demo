import type CPUFallbackLUT from './CPUFallbackLUT';
import type CPUFallbackColormap from './CPUFallbackColormap';
import type CPUFallbackEnabledElement from './CPUFallbackEnabledElement';
import type { PixelDataTypedArray } from './PixelDataTypedArray';
import type VoxelManager from '../utilities/VoxelManager';
import { ImageQualityStatus } from '../enums';
import IImageCalibration from './IImageCalibration';
import RGB from './RGB';
interface IImage {
    imageId: string;
    referencedImageId?: string;
    sharedCacheKey?: string;
    isPreScaled?: boolean;
    preScale?: {
        enabled: boolean;
        scaled?: boolean;
        scalingParameters?: {
            modality?: string;
            rescaleSlope?: number;
            rescaleIntercept?: number;
            suvbw?: number;
        };
    };
    minPixelValue: number;
    maxPixelValue: number;
    slope: number;
    intercept: number;
    windowCenter: number[] | number;
    windowWidth: number[] | number;
    voiLUTFunction: string;
    getPixelData: () => PixelDataTypedArray;
    getCanvas: () => HTMLCanvasElement;
    rows: number;
    columns: number;
    height: number;
    width: number;
    color: boolean;
    rgba: boolean;
    numComps: number;
    render?: (enabledElement: CPUFallbackEnabledElement, invalidated: boolean) => unknown;
    columnPixelSpacing: number;
    rowPixelSpacing: number;
    sliceThickness?: number;
    invert: boolean;
    photometricInterpretation?: string;
    sizeInBytes: number;
    modalityLUT?: CPUFallbackLUT;
    voiLUT?: CPUFallbackLUT;
    colormap?: CPUFallbackColormap;
    scaling?: {
        PT?: {
            SUVlbmFactor?: number;
            SUVbsaFactor?: number;
            suvbwToSuvlbm?: number;
            suvbwToSuvbsa?: number;
        };
    };
    loadTimeInMS?: number;
    decodeTimeInMS?: number;
    stats?: {
        lastStoredPixelDataToCanvasImageDataTime?: number;
        lastGetPixelDataTime?: number;
        lastPutImageDataTime?: number;
        lastLutGenerateTime?: number;
        lastRenderedViewport?: unknown;
        lastRenderTime?: number;
    };
    cachedLut?: {
        windowWidth?: number | number[];
        windowCenter?: number | number[];
        invert?: boolean;
        lutArray?: Uint8ClampedArray;
        modalityLUT?: unknown;
        voiLUT?: CPUFallbackLUT;
    };
    imageQualityStatus?: ImageQualityStatus;
    calibration?: IImageCalibration;
    imageFrame?: any;
    voxelManager?: VoxelManager<number> | VoxelManager<RGB>;
    bufferView?: {
        buffer: ArrayBuffer;
        offset: number;
    };
}
export default IImage;
