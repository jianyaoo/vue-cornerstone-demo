declare class SegmentationRenderingEngine {
    private _needsRender;
    private _animationFrameSet;
    private _animationFrameHandle;
    hasBeenDestroyed: boolean;
    removeToolGroup(toolGroupId: any): void;
    renderToolGroupSegmentations(toolGroupId: any): void;
    private _throwIfDestroyed;
    private _setToolGroupSegmentationToBeRenderedNextFrame;
    private _render;
    private _renderFlaggedToolGroups;
    _triggerRender(toolGroupId: any): void;
    private _reset;
}
declare const segmentationRenderingEngine: SegmentationRenderingEngine;
declare function triggerSegmentationRender(toolGroupId: string): void;
export { segmentationRenderingEngine, triggerSegmentationRender };
export default triggerSegmentationRender;
