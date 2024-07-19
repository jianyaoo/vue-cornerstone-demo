import { Enums, ImageVolume, imageLoader } from '@cornerstonejs/core';
import type { Types, IImagesLoader, ImageLoadListener } from '@cornerstonejs/core';
export default class BaseStreamingImageVolume extends ImageVolume implements IImagesLoader {
    private framesLoaded;
    private framesProcessed;
    private framesUpdated;
    protected autoRenderOnLoad: boolean;
    protected cachedFrames: any[];
    protected reRenderTarget: number;
    protected reRenderFraction: number;
    loadStatus: {
        loaded: boolean;
        loading: boolean;
        cancelled: boolean;
        callbacks: Array<(...args: unknown[]) => void>;
    };
    imagesLoader: IImagesLoader;
    constructor(imageVolumeProperties: Types.ImageVolumeProps, streamingProperties: Types.IStreamingVolumeProperties);
    protected invalidateVolume(immediate: boolean): void;
    cancelLoading: () => void;
    clearLoadCallbacks(): void;
    protected callLoadStatusCallback(evt: any): void;
    protected updateTextureAndTriggerEvents(imageIdIndex: any, imageId: any, imageQualityStatus?: Enums.ImageQualityStatus): void;
    successCallback(imageId: string, image: any): void;
    errorCallback(imageId: any, permanent: any, error: any): void;
    load: (callback: (...args: unknown[]) => void) => void;
    getLoaderImageOptions(imageId: string): {
        targetBuffer: {
            arrayBuffer: SharedArrayBuffer;
            offset: number;
            length: number;
            type: any;
            rows: any;
            columns: any;
        };
        skipCreateImage: boolean;
        allowFloatRendering: boolean;
        preScale: {
            enabled: boolean;
            scalingParameters: Types.ScalingParameters;
        };
        transferPixelData: boolean;
        transferSyntaxUID: any;
        loader: typeof imageLoader.loadImage;
        additionalDetails: {
            imageId: string;
            imageIdIndex: number;
            volumeId: string;
        };
    };
    callLoadImage(imageId: any, imageIdIndex: any, options: any): any;
    protected getImageIdsRequests(imageIds: string[], priorityDefault: number): {
        callLoadImage: (imageId: any, imageIdIndex: any, options: any) => any;
        imageId: string;
        imageIdIndex: number;
        options: {
            targetBuffer: {
                arrayBuffer: SharedArrayBuffer;
                offset: number;
                length: number;
                type: any;
                rows: any;
                columns: any;
            };
            skipCreateImage: boolean;
            allowFloatRendering: boolean;
            preScale: {
                enabled: boolean;
                scalingParameters: Types.ScalingParameters;
            };
            transferPixelData: boolean;
            transferSyntaxUID: any;
            loader: typeof imageLoader.loadImage;
            additionalDetails: {
                imageId: string;
                imageIdIndex: number;
                volumeId: string;
            };
        };
        priority: number;
        requestType: Enums.RequestType;
        additionalDetails: {
            volumeId: string;
        };
    }[];
    private handleImageComingFromCache;
    getImageLoadRequests(_priority: number): any[];
    getImageIdsToLoad(): string[];
    loadImages(imageIds: string[], listener: ImageLoadListener): Promise<boolean>;
    private _prefetchImageIds;
    private _scaleIfNecessary;
    private _addScalingToVolume;
}
