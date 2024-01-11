import { CPUFallbackTransform, Point2, TransformMatrix2D } from '../../../../types';
export declare class Transform implements CPUFallbackTransform {
    private m;
    constructor();
    getMatrix(): TransformMatrix2D;
    reset(): void;
    clone(): CPUFallbackTransform;
    multiply(matrix: TransformMatrix2D): void;
    invert(): void;
    rotate(rad: number): void;
    translate(x: number, y: number): void;
    scale(sx: number, sy: number): void;
    transformPoint(point: Point2): Point2;
}
