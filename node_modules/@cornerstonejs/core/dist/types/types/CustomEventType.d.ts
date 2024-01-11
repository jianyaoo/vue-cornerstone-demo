interface CustomEvent<T = any> extends Event {
    readonly detail: T;
    initCustomEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, detailArg: T): void;
}
export default CustomEvent;
//# sourceMappingURL=CustomEventType.d.ts.map