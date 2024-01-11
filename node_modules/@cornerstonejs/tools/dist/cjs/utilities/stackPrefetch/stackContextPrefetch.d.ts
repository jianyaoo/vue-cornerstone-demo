declare function disable(element: any): void;
declare function getConfiguration(): {
    maxImagesToPrefetch: number;
    minBefore: number;
    maxAfter: number;
    directionExtraImages: number;
    preserveExistingPool: boolean;
};
declare function setConfiguration(config: any): void;
declare const stackContextPrefetch: {
    enable: (element: any) => void;
    disable: typeof disable;
    getConfiguration: typeof getConfiguration;
    setConfiguration: typeof setConfiguration;
};
export default stackContextPrefetch;
