import type { IImage, CPUFallbackLookupTable } from '../../../../types';
declare function storedPixelDataToCanvasImageDataPseudocolorLUTPET(image: IImage, lutFunction: (value: number) => number, colorLUT: CPUFallbackLookupTable, canvasImageDataData: Uint8ClampedArray): void;
export default storedPixelDataToCanvasImageDataPseudocolorLUTPET;
