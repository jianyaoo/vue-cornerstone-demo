import IGeometry from './IGeometry';
import IImage from './IImage';
import IImageVolume from './IImageVolume';
export interface IImageLoadObject {
    promise: Promise<IImage>;
    cancelFn?: () => void;
    decache?: () => void;
}
export interface IVolumeLoadObject {
    promise: Promise<IImageVolume>;
    cancelFn?: () => void;
    decache?: () => void;
}
export interface IGeometryLoadObject {
    promise: Promise<IGeometry>;
    cancelFn?: () => void;
    decache?: () => void;
}
//# sourceMappingURL=ILoadObject.d.ts.map