import type { Types } from '@cornerstonejs/core';
export declare type AutoPanCallbackData = {
    points: {
        currentPosition: {
            canvas: Types.Point2;
            world: Types.Point3;
        };
        newPosition: {
            canvas: Types.Point2;
            world: Types.Point3;
        };
    };
    delta: {
        canvas: Types.Point2;
        world: Types.Point3;
    };
};
export declare type AutoPanCallback = (data: AutoPanCallbackData) => void;
declare class AdvancedMagnifyViewport {
    private _viewportId;
    private _sourceEnabledElement;
    private _enabledElement;
    private _sourceToolGroup;
    private _magnifyToolGroup;
    private _isViewportReady;
    private _radius;
    private _resized;
    private _resizeViewportAsync;
    private _canAutoPan;
    private _autoPan;
    position: Types.Point2;
    zoomFactor: number;
    visible: boolean;
    constructor({ magnifyViewportId, sourceEnabledElement, radius, position, zoomFactor, autoPan, }: {
        magnifyViewportId?: string;
        sourceEnabledElement: Types.IEnabledElement;
        radius?: number;
        position?: Types.Point2;
        zoomFactor: number;
        autoPan: {
            enabled: boolean;
            padding: number;
            callback: AutoPanCallback;
        };
    });
    get sourceEnabledElement(): Types.IEnabledElement;
    get viewportId(): string;
    get radius(): number;
    set radius(radius: number);
    update(): void;
    dispose(): void;
    private _handleToolModeChanged;
    private _inheritBorderRadius;
    private _createViewportNode;
    private _convertZoomFactorToParallelScale;
    private _isStackViewport;
    private _isVolumeViewport;
    private _cloneToolGroups;
    private _cloneStack;
    private _cloneVolumes;
    private _cloneViewport;
    private _cancelMouseEventCallback;
    private _browserMouseUpCallback;
    private _browserMouseDownCallback;
    private _mouseDragCallback;
    private _addBrowserEventListeners;
    private _removeBrowserEventListeners;
    private _addEventListeners;
    private _removeEventListeners;
    private _initialize;
    private _syncViewportsCameras;
    private _syncStackViewports;
    private _syncViewports;
    private _resizeViewport;
}
export { AdvancedMagnifyViewport as default, AdvancedMagnifyViewport };
