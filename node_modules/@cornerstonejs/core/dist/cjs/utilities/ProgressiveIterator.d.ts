export declare class PromiseIterator<T> extends Promise<T> {
    iterator?: ProgressiveIterator<T>;
}
export declare type ErrorCallback = (message: string | Error) => void;
export default class ProgressiveIterator<T> {
    done: any;
    name?: string;
    private nextValue;
    private waiting;
    private rejectReason;
    constructor(name?: any);
    static as(promise: any): any;
    add(x: T, done?: boolean): void;
    resolve(): void;
    reject(reason: Error): void;
    getRecent(): T;
    [Symbol.asyncIterator](): AsyncGenerator<any, void, unknown>;
    forEach(callback: any, errorCallback: any): Promise<void>;
    generate(processFunction: any, errorCallback?: ErrorCallback): Promise<any>;
    nextPromise(): Promise<T>;
    donePromise(): Promise<T>;
    getNextPromise(): PromiseIterator<T>;
    getDonePromise(): PromiseIterator<T>;
}
