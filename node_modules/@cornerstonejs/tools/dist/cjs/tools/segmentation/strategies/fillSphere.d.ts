import BrushStrategy from './BrushStrategy';
declare const SPHERE_STRATEGY: BrushStrategy;
declare const fillInsideSphere: (enabledElement: any, operationData: any) => unknown;
declare const thresholdInsideSphere: (enabledElement: any, operationData: any) => unknown;
export declare function fillOutsideSphere(): void;
export { fillInsideSphere, thresholdInsideSphere, SPHERE_STRATEGY };
