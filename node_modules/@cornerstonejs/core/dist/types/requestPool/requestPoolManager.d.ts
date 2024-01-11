import RequestType from '../enums/RequestType';
import { IImage } from '../types';
declare type AdditionalDetails = {
    imageId?: string;
    volumeId?: string;
};
declare type RequestDetailsInterface = {
    requestFn: () => Promise<IImage | void>;
    type: RequestType;
    additionalDetails: AdditionalDetails;
};
declare type RequestPool = {
    [name in RequestType]: {
        [key: number]: RequestDetailsInterface[];
    };
};
declare class RequestPoolManager {
    private id;
    private awake;
    private requestPool;
    private numRequests;
    maxNumRequests: {
        interaction: number;
        thumbnail: number;
        prefetch: number;
        compute: number;
    };
    grabDelay: number;
    private timeoutHandle;
    constructor(id?: string);
    setMaxSimultaneousRequests(type: RequestType, maxNumRequests: number): void;
    getMaxSimultaneousRequests(type: RequestType): number;
    destroy(): void;
    addRequest(requestFn: () => Promise<IImage | void>, type: RequestType, additionalDetails: Record<string, unknown>, priority?: number): void;
    filterRequests(filterFunction: (requestDetails: RequestDetailsInterface) => boolean): void;
    clearRequestStack(type: string): void;
    private sendRequests;
    private getNextRequest;
    protected startGrabbing(): void;
    protected startAgain(): void;
    protected getSortedPriorityGroups(type: string): Array<number>;
    getRequestPool(): RequestPool;
}
export { RequestPoolManager };
//# sourceMappingURL=requestPoolManager.d.ts.map