declare class CornerstoneEventTarget implements EventTarget {
    private listeners;
    private debouncedListeners;
    constructor();
    reset(): void;
    addEventListenerOnce(type: any, callback: any): void;
    addEventListener(type: any, callback: any): void;
    addEventListenerDebounced(type: any, callback: any, delay: any): void;
    removeEventListenerDebounced(type: any, callback: any): void;
    removeEventListener(type: any, callback: any): void;
    dispatchEvent(event: any): boolean;
}
declare const eventTarget: CornerstoneEventTarget;
export default eventTarget;
//# sourceMappingURL=eventTarget.d.ts.map