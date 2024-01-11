import { IImage } from '../types';
export default function renderToCanvasCPU(canvas: HTMLCanvasElement, image: IImage, modality?: string, renderingEngineId?: string): Promise<string>;
