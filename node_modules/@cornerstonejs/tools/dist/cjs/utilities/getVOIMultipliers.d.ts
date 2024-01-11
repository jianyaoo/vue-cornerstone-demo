import { Types } from '@cornerstonejs/core';
declare function getVOIMultipliers(viewport: Types.IStackViewport | Types.IVolumeViewport, volumeId?: string, options?: {
    fixedPTWindowWidth?: boolean;
}): [number, number];
export { getVOIMultipliers as default, getVOIMultipliers };
