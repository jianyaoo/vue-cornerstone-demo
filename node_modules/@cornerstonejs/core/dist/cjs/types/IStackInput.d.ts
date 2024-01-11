import { ImageActor } from './IActor';
declare type StackInputCallback = (params: {
    imageActor: ImageActor;
    imageId: string;
}) => unknown;
interface IStackInput {
    imageId: string;
    actorUID?: string;
    visibility?: boolean;
    callback?: StackInputCallback;
}
export type { IStackInput, StackInputCallback };
