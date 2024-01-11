import { ImageQualityStatus } from '../enums';
interface IStreamingVolumeProperties {
    imageIds: Array<string>;
    loadStatus: {
        loaded: boolean;
        loading: boolean;
        cancelled: boolean;
        cachedFrames: Array<ImageQualityStatus>;
        callbacks: Array<() => void>;
    };
}
export default IStreamingVolumeProperties;
//# sourceMappingURL=IStreamingVolumeProperties.d.ts.map