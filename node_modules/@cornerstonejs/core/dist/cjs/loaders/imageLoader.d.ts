import { IImage, ImageLoaderFn, Point2, Point3, Mat3, PixelDataTypedArrayString, PixelDataTypedArray } from '../types';
export interface ImageLoaderOptions {
    priority: number;
    requestType: string;
    additionalDetails?: Record<string, unknown>;
    ignoreCache?: boolean;
}
interface DerivedImages {
    imageIds: Array<string>;
    promises: Array<Promise<IImage>>;
}
declare type LocalImageOptions = {
    scalarData?: PixelDataTypedArray;
    targetBufferType?: PixelDataTypedArrayString;
    dimensions?: Point2;
    spacing?: Point3;
    origin?: Point3;
    direction?: Mat3;
    skipCreateBuffer?: boolean;
    onCacheAdd?: (image: IImage) => void;
};
declare type DerivedImageOptions = LocalImageOptions & {
    imageId?: string;
    targetBufferType?: PixelDataTypedArrayString;
};
export declare function loadImage(imageId: string, options?: ImageLoaderOptions): Promise<IImage>;
export declare function loadAndCacheImage(imageId: string, options?: ImageLoaderOptions): Promise<IImage>;
export declare function loadAndCacheImages(imageIds: Array<string>, options?: ImageLoaderOptions): Promise<IImage>[];
export declare function createAndCacheDerivedImage(referencedImageId: string, options?: DerivedImageOptions, preventCache?: boolean): Promise<IImage>;
export declare function createAndCacheDerivedImages(referencedImageIds: Array<string>, options?: DerivedImageOptions & {
    getDerivedImageId?: (referencedImageId: string) => string;
    targetBufferType?: PixelDataTypedArrayString;
}): DerivedImages;
export declare function createAndCacheLocalImage(options: LocalImageOptions, imageId: string, preventCache?: boolean): IImage;
export declare function cancelLoadImage(imageId: string): void;
export declare function cancelLoadImages(imageIds: Array<string>): void;
export declare function cancelLoadAll(): void;
export declare function registerImageLoader(scheme: string, imageLoader: ImageLoaderFn): void;
export declare function registerUnknownImageLoader(imageLoader: ImageLoaderFn): ImageLoaderFn;
export declare function unregisterAllImageLoaders(): void;
export declare function createAndCacheDerivedSegmentationImages(referencedImageIds: Array<string>, options?: DerivedImageOptions): DerivedImages;
export declare function createAndCacheDerivedSegmentationImage(referencedImageId: string, options?: DerivedImageOptions): Promise<IImage>;
export {};
