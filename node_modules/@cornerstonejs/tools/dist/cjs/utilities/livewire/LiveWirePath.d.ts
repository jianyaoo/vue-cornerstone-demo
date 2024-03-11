import { Types } from '@cornerstonejs/core';
export declare class LivewirePath {
    pointArray: Types.Point2[];
    private _controlPointIndexes;
    constructor(inputPointArray?: Types.Point2[], inputControlPointIndexArray?: number[]);
    getPoint(index: number): Types.Point2;
    getLastPoint(): Types.Point2;
    isControlPoint(point: Types.Point2): boolean;
    addPoint(point: Types.Point2): void;
    addControlPoint(point: Types.Point2): void;
    getControlPoints(): Types.Point2[];
    getNumControlPoints(): number;
    removeLastControlPoint(): void;
    getLastControlPoint(): Types.Point2;
    removeLastPoints(count: number): void;
    addPoints(newPointArray: Types.Point2[]): void;
    prependPath(other: LivewirePath): void;
    appendPath(other: LivewirePath): void;
}
