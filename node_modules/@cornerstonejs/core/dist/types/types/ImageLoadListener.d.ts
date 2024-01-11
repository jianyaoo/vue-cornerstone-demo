export declare type ImageLoadListener = {
    successCallback: (imageId: any, image: any) => void;
    errorCallback: (imageId: any, permanent: any, reason: any) => void;
    getLoaderImageOptions?: (imageId: any) => Record<string, unknown>;
};
//# sourceMappingURL=ImageLoadListener.d.ts.map