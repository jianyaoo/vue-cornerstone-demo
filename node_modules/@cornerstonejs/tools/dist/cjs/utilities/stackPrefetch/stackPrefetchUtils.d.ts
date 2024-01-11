import { Enums } from '@cornerstonejs/core';
export declare const requestType = Enums.RequestType.Prefetch;
export declare const priority = 0;
export declare function range(lowEnd: any, highEnd: any): any[];
export declare function nearestIndex(arr: any, x: any): {
    low: number;
    high: number;
};
export declare function getStackData(element: any): {
    currentImageIdIndex: number;
    imageIds: string[];
};
export declare function getPromiseRemovedHandler(element: any): (e: any) => void;
export declare const clearFromImageIds: (stack: any) => (requestDetails: any) => boolean;
