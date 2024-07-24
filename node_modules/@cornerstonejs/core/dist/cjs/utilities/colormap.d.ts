import { ColormapPublic, ColormapRegistration } from '../types';
declare function registerColormap(colormap: ColormapRegistration): void;
declare function getColormap(name: any): any;
declare function getColormapNames(): any[];
declare function findMatchingColormap(rgbPoints: any, actor: any): ColormapPublic | null;
export { getColormap, getColormapNames, registerColormap, findMatchingColormap, };
