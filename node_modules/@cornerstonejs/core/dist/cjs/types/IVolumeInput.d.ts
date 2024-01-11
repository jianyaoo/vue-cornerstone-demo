import { VolumeActor } from './IActor';
import BlendModes from '../enums/BlendModes';
declare type VolumeInputCallback = (params: {
    volumeActor: VolumeActor;
    volumeId: string;
}) => unknown;
interface IVolumeInput {
    volumeId: string;
    actorUID?: string;
    visibility?: boolean;
    callback?: VolumeInputCallback;
    blendMode?: BlendModes;
    slabThickness?: number;
}
export type { IVolumeInput, VolumeInputCallback };
