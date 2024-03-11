import type { vtkImageData } from '@kitware/vtk.js/Common/DataModel/ImageData';
import type { VoxelManager } from '../utilities';
import { Metadata, PixelDataTypedArray, Point3, IImageLoadObject, Mat3, RGB } from '../types';
interface IImageVolume {
    readonly volumeId: string;
    dimensions: Point3;
    direction: Mat3;
    metadata: Metadata;
    origin: Point3;
    isPreScaled: boolean;
    scaling?: {
        PT?: {
            SUVlbmFactor?: number;
            SUVbsaFactor?: number;
            suvbwToSuvlbm?: number;
            suvbwToSuvbsa?: number;
        };
    };
    sizeInBytes?: number;
    spacing: Point3;
    numVoxels: number;
    imageData?: vtkImageData;
    vtkOpenGLTexture: any;
    loadStatus?: Record<string, any>;
    imageIds: Array<string>;
    referencedVolumeId?: string;
    referencedImageIds?: Array<string>;
    hasPixelSpacing: boolean;
    additionalDetails?: Record<string, any>;
    isDynamicVolume(): boolean;
    convertToCornerstoneImage?: (imageId: string, imageIdIndex: number) => IImageLoadObject;
    cancelLoading?: () => void;
    getScalarData(): PixelDataTypedArray;
    voxelManager?: VoxelManager<number> | VoxelManager<RGB>;
    convertToImageSlicesAndCache(): string[];
    getImageIdIndex(imageId: string): number;
    getImageURIIndex(imageURI: string): number;
    destroy(): void;
    decache?: (completelyRemove?: boolean) => void;
    get imageCacheOffsetMap(): Map<string, any>;
    modified(): void;
}
export default IImageVolume;
//# sourceMappingURL=IImageVolume.d.ts.map