import type { IImage, CPUFallbackLookupTable } from '../../../../types';
declare function storedPixelDataToCanvasImageDataColorLUT(image: IImage, colorLUT: CPUFallbackLookupTable, canvasImageDataData: Uint8ClampedArray): void;
export default storedPixelDataToCanvasImageDataColorLUT;
