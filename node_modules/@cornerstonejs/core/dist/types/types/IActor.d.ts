import type vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import type vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
export declare type Actor = vtkActor;
export declare type VolumeActor = vtkVolume;
export declare type ImageActor = vtkImageSlice;
export interface ICanvasActor {
    render(viewport: any, context: any): void;
    getMapper(): any;
    getProperty(): any;
    isA(actorType: any): boolean;
    getClassName(): string;
}
export declare type ActorEntry = {
    uid: string;
    actor: Actor | VolumeActor | ImageActor | ICanvasActor;
    referenceId?: string;
    slabThickness?: number;
    clippingFilter?: any;
};
//# sourceMappingURL=IActor.d.ts.map