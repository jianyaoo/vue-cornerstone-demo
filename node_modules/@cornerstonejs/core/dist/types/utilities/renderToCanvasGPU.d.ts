import { IImage, IVolume, ViewportInputOptions, ViewReference } from '../types';
import { CanvasLoadPosition } from './loadImageToCanvas';
export default function renderToCanvasGPU(canvas: HTMLCanvasElement, imageOrVolume: IImage | IVolume, modality?: any, renderingEngineId?: string, viewportOptions?: ViewportInputOptions & {
    viewReference?: ViewReference;
}): Promise<CanvasLoadPosition>;
//# sourceMappingURL=renderToCanvasGPU.d.ts.map