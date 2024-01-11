import { IImageLoadObject, IVolumeLoadObject } from './ILoadObject';
interface ICache {
    setMaxCacheSize: (maxCacheSize: number) => void;
    getMaxCacheSize: () => number;
    getCacheSize: () => number;
    putImageLoadObject: (imageId: string, imageLoadObject: IImageLoadObject, updateCache?: boolean) => Promise<any>;
    getImageLoadObject: (imageId: string) => IImageLoadObject | void;
    putVolumeLoadObject: (volumeId: string, volumeLoadObject: IVolumeLoadObject) => Promise<any>;
    getVolumeLoadObject: (volumeId: string) => IVolumeLoadObject | void;
    purgeCache: () => void;
}
export default ICache;
