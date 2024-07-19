import type { Types } from '@cornerstonejs/core';
import { AdvancedMagnifyViewport, AutoPanCallback } from './AdvancedMagnifyViewport';
import { AdvancedMagnifyAnnotation } from '../types/ToolSpecificAnnotationTypes';
export declare type MagnifyViewportInfo = {
    magnifyViewportId?: string;
    sourceEnabledElement: Types.IEnabledElement;
    position: Types.Point2;
    radius: number;
    zoomFactor: number;
    autoPan: {
        enabled: boolean;
        padding: number;
        callback: AutoPanCallback;
    };
};
declare class AdvancedMagnifyViewportManager {
    private static _singleton;
    private _magnifyViewportsMap;
    constructor();
    static getInstance(): AdvancedMagnifyViewportManager;
    createViewport: (annotation: AdvancedMagnifyAnnotation, viewportInfo: MagnifyViewportInfo) => AdvancedMagnifyViewport;
    getViewport(magnifyViewportId: string): AdvancedMagnifyViewport;
    dispose(): void;
    destroyViewport(magnifyViewportId: string): void;
    private _destroyViewports;
    private _annotationRemovedCallback;
    private _getMagnifyViewportsMapEntriesBySourceViewportId;
    private _newStackImageCallback;
    private _newVolumeImageCallback;
    private _reset;
    private _addEventListeners;
    private _removeEventListeners;
    private _addSourceElementEventListener;
    private _removeSourceElementEventListener;
    private _initialize;
}
export { AdvancedMagnifyViewportManager as default, AdvancedMagnifyViewportManager, };
