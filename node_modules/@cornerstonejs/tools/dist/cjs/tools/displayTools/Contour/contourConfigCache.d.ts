declare type ConfigCache = {
    segmentsHidden: Set<number>;
    outlineWidthActive: number;
    visibility: boolean;
};
export declare function getConfigCache(segmentationRepresentationUID: string): ConfigCache;
export declare function setConfigCache(segmentationRepresentationUID: string, config: ConfigCache): void;
export declare function deleteConfigCache(segmentationRepresentationUID: string): void;
export {};
