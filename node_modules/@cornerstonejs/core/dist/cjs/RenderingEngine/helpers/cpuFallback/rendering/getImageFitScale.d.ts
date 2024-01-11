import { IImage } from '../../../../types';
export default function (canvas: HTMLCanvasElement, image: IImage, rotation?: number | null): {
    verticalScale: number;
    horizontalScale: number;
    scaleFactor: number;
};
