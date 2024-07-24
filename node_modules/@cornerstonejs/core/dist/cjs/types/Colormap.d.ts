import RGB from './RGB';
declare type ColormapRegistration = {
    ColorSpace: string;
    Name: string;
    RGBPoints: RGB[] | number[];
};
declare type OpacityMapping = {
    value: number;
    opacity: number;
};
declare type ColormapPublic = {
    name?: string;
    opacity?: OpacityMapping[] | number;
};
export type { ColormapRegistration, ColormapPublic, OpacityMapping };
