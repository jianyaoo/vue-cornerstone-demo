import { Types } from '..';
declare type actorTypes = 'vtkActor' | 'vtkVolume' | 'vtkImageSlice';
export declare function isImageActor(actorEntry: Types.ActorEntry): boolean;
export declare function actorIsA(actorEntry: Types.ActorEntry, actorType: actorTypes): boolean;
export {};
