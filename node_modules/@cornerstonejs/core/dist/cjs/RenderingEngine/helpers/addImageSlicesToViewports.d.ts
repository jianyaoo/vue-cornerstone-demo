import type { IStackInput, IRenderingEngine } from '../../types';
declare function addImageSlicesToViewports(renderingEngine: IRenderingEngine, stackInputs: Array<IStackInput>, viewportIds: Array<string>): Promise<void>;
export default addImageSlicesToViewports;
