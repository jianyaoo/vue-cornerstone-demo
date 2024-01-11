import { ImageQualityStatus, RequestType } from '../enums';
import { ImageLoadListener } from './ImageLoadListener';
export interface RetrieveStage {
    id: string;
    positions?: number[];
    decimate?: number;
    offset?: number;
    retrieveType?: string;
    requestType?: RequestType;
    priority?: number;
    nearbyFrames?: NearbyFrames[];
}
export declare type NearbyFrames = {
    offset: number;
    imageQualityStatus?: ImageQualityStatus;
};
export declare type BaseRetrieveOptions = {
    urlArguments?: string;
    framesPath?: string;
    decodeLevel?: number;
    imageQualityStatus?: ImageQualityStatus;
};
export declare type RangeRetrieveOptions = BaseRetrieveOptions & {
    rangeIndex: number;
    chunkSize?: number | ((metadata: any) => number);
};
export declare type StreamingRetrieveOptions = BaseRetrieveOptions & {
    streaming: boolean;
};
export declare type RetrieveOptions = BaseRetrieveOptions | StreamingRetrieveOptions | RangeRetrieveOptions;
export interface IRetrieveConfiguration {
    create?: (IRetrieveConfiguration: any) => IImagesLoader;
    retrieveOptions?: Record<string, RetrieveOptions>;
    stages?: RetrieveStage[];
}
export interface IImagesLoader {
    loadImages: (imageIds: string[], listener: ImageLoadListener) => Promise<unknown>;
}
