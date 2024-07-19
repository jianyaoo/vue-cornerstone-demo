import { ICamera, IImageVolume, IVolumeViewport } from '../types';
export default function getTargetVolumeAndSpacingInNormalDir(viewport: IVolumeViewport, camera: ICamera, targetId?: string, useSlabThickness?: boolean): {
    imageVolume: IImageVolume;
    spacingInNormalDirection: number;
    actorUID: string;
};
//# sourceMappingURL=getTargetVolumeAndSpacingInNormalDir.d.ts.map