import type { IRenderingEngine } from '../types';
import type IStackViewport from './IStackViewport';
import type IVolumeViewport from './IVolumeViewport';
interface IEnabledElement {
    viewport: IStackViewport | IVolumeViewport;
    renderingEngine: IRenderingEngine;
    viewportId: string;
    renderingEngineId: string;
    FrameOfReferenceUID: string;
}
export default IEnabledElement;
//# sourceMappingURL=IEnabledElement.d.ts.map