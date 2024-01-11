import { ActorSliceRange, IVolumeViewport, ICamera } from '../types';
declare function getVolumeSliceRangeInfo(viewport: IVolumeViewport, volumeId: string, useSlabThickness?: boolean): {
    sliceRange: ActorSliceRange;
    spacingInNormalDirection: number;
    camera: ICamera;
};
export default getVolumeSliceRangeInfo;
