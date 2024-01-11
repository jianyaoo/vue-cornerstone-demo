import type { Types } from '@cornerstonejs/core';
import StreamingImageVolume from './StreamingImageVolume';
interface IVolumeLoader {
    promise: Promise<StreamingImageVolume>;
    cancel: () => void;
    decache: () => void;
}
declare function cornerstoneStreamingImageVolumeLoader(volumeId: string, options: {
    imageIds: string[];
    progressiveRendering?: boolean | Types.IRetrieveConfiguration;
}): IVolumeLoader;
export default cornerstoneStreamingImageVolumeLoader;
