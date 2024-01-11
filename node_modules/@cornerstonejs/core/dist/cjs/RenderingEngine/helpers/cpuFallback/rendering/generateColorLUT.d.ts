import { IImage, CPUFallbackLUT } from '../../../../types';
export default function generateColorLUT(image: IImage, windowWidth: number | number[], windowCenter: number | number[], invert: boolean, voiLUT?: CPUFallbackLUT): Uint8ClampedArray;
