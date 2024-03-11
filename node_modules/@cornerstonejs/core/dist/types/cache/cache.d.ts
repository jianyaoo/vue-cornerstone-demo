import { ICache, IImage, IGeometry, IImageLoadObject, IVolumeLoadObject, IGeometryLoadObject, ICachedImage, IImageVolume } from '../types';
declare class Cache implements ICache {
    private readonly _imageCache;
    private readonly _volumeCache;
    private readonly _geometryCache;
    private _imageCacheSize;
    private _volumeCacheSize;
    private _maxCacheSize;
    private _maxInstanceSize;
    constructor();
    setMaxCacheSize: (newMaxCacheSize: number) => void;
    isCacheable: (byteLength: number) => boolean;
    getMaxCacheSize: () => number;
    getMaxInstanceSize: () => number;
    getCacheSize: () => number;
    getBytesAvailable(): number;
    private _decacheImage;
    private _decacheVolume;
    purgeCache: () => void;
    purgeVolumeCache: () => void;
    decacheIfNecessaryUntilBytesAvailable(numBytes: number, volumeImageIds?: Array<string>): number | undefined;
    putImageLoadObject(imageId: string, imageLoadObject: IImageLoadObject): Promise<any>;
    getImageLoadObject(imageId: string): IImageLoadObject;
    isLoaded(imageId: string): boolean;
    getVolumeContainingImageId(imageId: string): {
        volume: IImageVolume;
        imageIdIndex: number;
    };
    getCachedImageBasedOnImageURI(imageId: string): ICachedImage | undefined;
    putVolumeLoadObject(volumeId: string, volumeLoadObject: IVolumeLoadObject): Promise<any>;
    getVolumeLoadObject: (volumeId: string) => IVolumeLoadObject;
    getGeometry: (geometryId: string) => IGeometry;
    getImage: (imageId: string) => IImage;
    getVolume: (volumeId: string) => IImageVolume;
    getVolumes: () => Array<IImageVolume>;
    filterVolumesByReferenceId: (volumeId: string) => Array<IImageVolume>;
    removeImageLoadObject: (imageId: string) => void;
    removeVolumeLoadObject: (volumeId: string) => void;
    putGeometryLoadObject: (geometryId: string, geometryLoadObject: IGeometryLoadObject) => Promise<void>;
    incrementImageCacheSize: (increment: number) => void;
    incrementVolumeCacheSize: (increment: number) => void;
    decrementImageCacheSize: (decrement: number) => void;
    decrementVolumeCacheSize: (decrement: number) => void;
    private _restoreImagesFromBuffer;
}
declare const cache: Cache;
export default cache;
export { Cache };
//# sourceMappingURL=cache.d.ts.map