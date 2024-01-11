export declare class BucketQueue<T> {
    private _bucketCount;
    private _mask;
    private _size;
    private _currentBucketIndex;
    private _getPriority;
    private _areEqual;
    private _buckets;
    constructor({ numBits, getPriority, areEqual, }: {
        numBits: number;
        getPriority?: (item: T) => number;
        areEqual?: (itemA: T, itemB: T) => boolean;
    });
    push(item: T): void;
    pop(): T;
    remove(item: T): boolean;
    isEmpty(): boolean;
    private _getBucketIndex;
    private _buildArray;
}
