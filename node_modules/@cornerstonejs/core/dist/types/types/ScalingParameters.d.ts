declare type ScalingParameters = {
    rescaleSlope: number;
    rescaleIntercept: number;
    modality: string;
    suvbw?: number;
    suvlbm?: number;
    suvbsa?: number;
};
declare type PTScaling = {
    suvbwToSuvlbm?: number;
    suvbwToSuvbsa?: number;
    suvbw?: number;
    suvlbm?: number;
    suvbsa?: number;
};
declare type Scaling = {
    PT?: PTScaling;
};
export { PTScaling, Scaling, ScalingParameters };
//# sourceMappingURL=ScalingParameters.d.ts.map