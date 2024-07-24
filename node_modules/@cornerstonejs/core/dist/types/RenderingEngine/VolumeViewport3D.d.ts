import { BlendModes } from '../enums';
import type { ViewportInput } from '../types/IViewport';
import BaseVolumeViewport from './BaseVolumeViewport';
declare class VolumeViewport3D extends BaseVolumeViewport {
    constructor(props: ViewportInput);
    resetCamera(resetPan?: boolean, resetZoom?: boolean, resetToCenter?: boolean): boolean;
    getRotation: () => number;
    getCurrentImageIdIndex: () => number | undefined;
    getCurrentImageId: () => string;
    setSlabThickness(slabThickness: number, filterActorUIDs?: Array<string>): void;
    setBlendMode(blendMode: BlendModes, filterActorUIDs?: string[], immediate?: boolean): void;
    resetProperties(volumeId?: string): void;
    resetSlabThickness(): void;
}
export default VolumeViewport3D;
//# sourceMappingURL=VolumeViewport3D.d.ts.map