import { mat4 } from 'gl-matrix';
import { IVolumeViewport } from '../types';
declare function getCurrentVolumeViewportSlice(viewport: IVolumeViewport): {
    width: number;
    height: number;
    scalarData: any;
    sliceToIndexMatrix: mat4;
    indexToSliceMatrix: mat4;
};
export { getCurrentVolumeViewportSlice as default, getCurrentVolumeViewportSlice, };
