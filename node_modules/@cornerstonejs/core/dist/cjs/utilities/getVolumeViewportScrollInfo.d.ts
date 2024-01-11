import { IVolumeViewport } from '../types';
declare function getVolumeViewportScrollInfo(viewport: IVolumeViewport, volumeId: string, useSlabThickness?: boolean): {
    numScrollSteps: number;
    currentStepIndex: number;
    sliceRangeInfo: {
        sliceRange: import("../types/ActorSliceRange").default;
        spacingInNormalDirection: number;
        camera: import("../types/ICamera").default;
    };
};
export default getVolumeViewportScrollInfo;
