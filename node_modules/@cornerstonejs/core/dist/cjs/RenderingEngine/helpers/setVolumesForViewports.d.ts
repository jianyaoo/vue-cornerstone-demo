import type { IVolumeInput, IRenderingEngine } from '../../types';
declare function setVolumesForViewports(renderingEngine: IRenderingEngine, volumeInputs: Array<IVolumeInput>, viewportIds: Array<string>, immediateRender?: boolean, suppressEvents?: boolean): Promise<void>;
export default setVolumesForViewports;
