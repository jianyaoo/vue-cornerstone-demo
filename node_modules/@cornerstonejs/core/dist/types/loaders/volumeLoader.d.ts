import '@kitware/vtk.js/Rendering/Profiles/Volume';
import { Point3, Metadata, Mat3, IImageVolume, VolumeLoaderFn, PixelDataTypedArray, PixelDataTypedArrayString } from '../types';
interface VolumeLoaderOptions {
    imageIds: Array<string>;
}
interface DerivedVolumeOptions {
    volumeId: string;
    targetBuffer?: {
        type: PixelDataTypedArrayString;
        sharedArrayBuffer?: boolean;
    };
}
interface LocalVolumeOptions {
    metadata: Metadata;
    dimensions: Point3;
    spacing: Point3;
    origin: Point3;
    direction: Mat3;
    scalarData?: PixelDataTypedArray;
    imageIds?: Array<string>;
    referencedImageIds?: Array<string>;
    referencedVolumeId?: string;
    targetBuffer?: {
        type: PixelDataTypedArrayString;
        sharedArrayBuffer?: boolean;
    };
}
export declare function loadVolume(volumeId: string, options?: VolumeLoaderOptions): Promise<IImageVolume>;
export declare function createAndCacheVolume(volumeId: string, options?: VolumeLoaderOptions): Promise<Record<string, any>>;
export declare function createAndCacheDerivedVolume(referencedVolumeId: string, options: DerivedVolumeOptions): Promise<IImageVolume>;
export declare function createLocalVolume(options: LocalVolumeOptions, volumeId: string, preventCache?: boolean): IImageVolume;
export declare function createAndCacheVolumeFromImages(volumeId: string, imageIds: string[], options?: {
    preventCache?: boolean;
    additionalDetails?: Record<string, any>;
}): Promise<IImageVolume>;
export declare function registerVolumeLoader(scheme: string, volumeLoader: VolumeLoaderFn): void;
export declare function getVolumeLoaderSchemes(): string[];
export declare function registerUnknownVolumeLoader(volumeLoader: VolumeLoaderFn): VolumeLoaderFn | undefined;
export declare function getUnknownVolumeLoaderSchema(): string;
export declare function createAndCacheDerivedSegmentationVolume(referencedVolumeId: string, options?: DerivedVolumeOptions): Promise<IImageVolume>;
export declare function createLocalSegmentationVolume(options: LocalVolumeOptions, volumeId: string, preventCache?: boolean): Promise<IImageVolume>;
export {};
//# sourceMappingURL=volumeLoader.d.ts.map