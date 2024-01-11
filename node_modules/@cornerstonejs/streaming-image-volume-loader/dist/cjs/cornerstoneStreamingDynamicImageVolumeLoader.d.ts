import StreamingDynamicImageVolume from './StreamingDynamicImageVolume';
interface IVolumeLoader {
    promise: Promise<StreamingDynamicImageVolume>;
    cancel: () => void;
    decache: () => void;
}
declare function cornerstoneStreamingDynamicImageVolumeLoader(volumeId: string, options: {
    imageIds: string[];
}): IVolumeLoader;
export default cornerstoneStreamingDynamicImageVolumeLoader;
