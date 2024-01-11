declare class MultiTargetEventListenerManager {
    private _targetsEventListeners;
    addEventListener(target: EventTarget, type: string, callback: EventListener, options?: AddEventListenerOptions): void;
    removeEventListener(target: EventTarget, type: string, callback?: EventListener, options?: EventListenerOptions): void;
    reset(): void;
}
export { MultiTargetEventListenerManager as default, MultiTargetEventListenerManager, };
