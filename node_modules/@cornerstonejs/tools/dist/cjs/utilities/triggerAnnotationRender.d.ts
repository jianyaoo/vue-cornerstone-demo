declare class AnnotationRenderingEngine {
    hasBeenDestroyed: boolean;
    private _needsRender;
    private _animationFrameSet;
    private _animationFrameHandle;
    private _viewportElements;
    constructor();
    addViewportElement(viewportId: string, element: HTMLDivElement): void;
    removeViewportElement(viewportId: string, element: HTMLDivElement): void;
    renderViewport(element: HTMLDivElement): void;
    private _throwIfDestroyed;
    private _renderFlaggedViewports;
    private _setAllViewportsToBeRenderedNextFrame;
    private _setViewportsToBeRenderedNextFrame;
    private _render;
    _triggerRender(element: any): void;
    private _reset;
}
declare const annotationRenderingEngine: AnnotationRenderingEngine;
declare function triggerAnnotationRender(element: HTMLDivElement): void;
export { annotationRenderingEngine, triggerAnnotationRender };
export default triggerAnnotationRender;
