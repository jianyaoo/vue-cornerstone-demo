import type { IImage, CPUFallbackLookupTable } from '../../../../types';
declare function storedPixelDataToCanvasImageDataPseudocolorLUT(image: IImage, grayscaleLut: Uint8ClampedArray, colorLUT: CPUFallbackLookupTable, canvasImageDataData: Uint8ClampedArray): void;
export default storedPixelDataToCanvasImageDataPseudocolorLUT;
