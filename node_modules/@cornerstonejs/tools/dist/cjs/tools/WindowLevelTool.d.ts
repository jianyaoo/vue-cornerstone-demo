import { BaseTool } from './base';
import { EventTypes } from '../types';
declare class WindowLevelTool extends BaseTool {
    static toolName: any;
    constructor(toolProps?: {}, defaultToolProps?: {
        supportedInteractionTypes: string[];
    });
    touchDragCallback(evt: EventTypes.InteractionEventType): void;
    mouseDragCallback(evt: EventTypes.InteractionEventType): void;
    getPTScaledNewRange({ deltaPointsCanvas, lower, upper, clientHeight, viewport, volumeId, isPreScaled, }: {
        deltaPointsCanvas: any;
        lower: any;
        upper: any;
        clientHeight: any;
        viewport: any;
        volumeId: any;
        isPreScaled: any;
    }): {
        lower: any;
        upper: any;
    };
    getNewRange({ viewport, deltaPointsCanvas, volumeId, lower, upper }: {
        viewport: any;
        deltaPointsCanvas: any;
        volumeId: any;
        lower: any;
        upper: any;
    }): {
        lower: number;
        upper: number;
    };
    _getMultiplierFromDynamicRange(viewport: any, volumeId: any): number;
    _getImageDynamicRangeFromViewport(viewport: any): number;
    _getImageDynamicRangeFromMiddleSlice: (scalarData: any, dimensions: any) => number;
    private _getMinMax;
}
export default WindowLevelTool;
