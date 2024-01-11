import type { WidgetProps, WidgetSize } from './types';
declare abstract class Widget {
    private _id;
    private _rootElement;
    private _containerSize;
    private _containerResizeObserver;
    constructor({ id, container }: WidgetProps);
    get id(): string;
    get rootElement(): HTMLElement;
    appendTo(container: HTMLElement): void;
    destroy(): void;
    protected get containerSize(): WidgetSize;
    protected createRootElement(id: string): HTMLElement;
    protected onContainerResize(): void;
    private _containerResizeCallback;
}
export { Widget as default, Widget };
