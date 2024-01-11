declare class TargetEventListeners {
    private _target;
    private _eventListeners;
    private _children;
    constructor(target: EventTarget);
    get isEmpty(): boolean;
    addEventListener(type: string, callback: EventListener, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, callback?: EventListener, options?: EventListenerOptions): void;
    reset(): void;
    private _addEventListener;
    private _removeEventListener;
    private _unregisterAllListeners;
    private _unregisterAllEvents;
}
export { TargetEventListeners as default, TargetEventListeners };
