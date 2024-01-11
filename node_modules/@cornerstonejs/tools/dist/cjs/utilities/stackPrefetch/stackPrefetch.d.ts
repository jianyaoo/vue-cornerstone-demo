declare function enable(element: any): void;
declare function disable(element: any): void;
declare function getConfiguration(): {
    maxImagesToPrefetch: number;
    preserveExistingPool: boolean;
};
declare function setConfiguration(config: any): void;
declare const stackPrefetch: {
    enable: typeof enable;
    disable: typeof disable;
    getConfiguration: typeof getConfiguration;
    setConfiguration: typeof setConfiguration;
};
export default stackPrefetch;
