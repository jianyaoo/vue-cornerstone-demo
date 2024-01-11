import { IColorMapPreset } from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import { ColorbarCanvasProps } from './types/ColorbarCanvasProps';
import type { ColorbarImageRange, ColorbarVOIRange } from './types';
import type { ColorbarSize } from './types/ColorbarSize';
declare class ColorbarCanvas {
    private _canvas;
    private _imageRange;
    private _voiRange;
    private _colormap;
    private _showFullImageRange;
    constructor(props: ColorbarCanvasProps);
    get colormap(): IColorMapPreset;
    set colormap(colormap: IColorMapPreset);
    get size(): ColorbarSize;
    set size(size: ColorbarSize);
    get imageRange(): ColorbarImageRange;
    set imageRange(imageRange: ColorbarImageRange);
    get voiRange(): ColorbarVOIRange;
    set voiRange(voiRange: ColorbarVOIRange);
    get showFullImageRange(): boolean;
    set showFullImageRange(showFullImageRange: boolean);
    appendTo(container: HTMLElement): void;
    dispose(): void;
    private static validateProps;
    private _setCanvasSize;
    private _createRootElement;
    private render;
}
export { ColorbarCanvas as default, ColorbarCanvas };
