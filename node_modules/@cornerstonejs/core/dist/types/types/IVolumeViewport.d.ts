import Point2 from './Point2';
import Point3 from './Point3';
import { IViewport } from './IViewport';
import { IVolumeInput } from './IVolumeInput';
import FlipDirection from './FlipDirection';
import IImageData from './IImageData';
import { BlendModes, OrientationAxis } from '../enums';
import { VolumeViewportProperties } from '.';
export default interface IVolumeViewport extends IViewport {
    useCPURendering: boolean;
    getFrameOfReferenceUID: () => string;
    getDefaultProperties: (volumeId?: string) => VolumeViewportProperties;
    getProperties: (volumeId?: string) => VolumeViewportProperties;
    canvasToWorld: (canvasPos: Point2) => Point3;
    worldToCanvas: (worldPos: Point3) => Point2;
    getImageIds: (volumeId?: string) => string[];
    getCurrentImageIdIndex: () => number;
    hasVolumeId: (volumeId: string) => boolean;
    hasImageURI: (imageURI: string) => boolean;
    getCurrentImageId: () => string;
    setDefaultProperties(ViewportProperties: VolumeViewportProperties, volumeId?: string): void;
    clearDefaultProperties(volumeId?: string): void;
    setProperties({ voiRange }: VolumeViewportProperties, volumeId?: string, suppressEvents?: boolean): void;
    resetProperties(volumeId: string): void;
    setVolumes(volumeInputArray: Array<IVolumeInput>, immediate?: boolean, suppressEvents?: boolean): Promise<void>;
    addVolumes(volumeInputArray: Array<IVolumeInput>, immediate?: boolean, suppressEvents?: boolean): Promise<void>;
    removeVolumeActors(actorUIDs: Array<string>, immediate?: boolean): void;
    getIntensityFromWorld(point: Point3): number;
    getBounds(): any;
    flip(flipDirection: FlipDirection): void;
    resetCamera(resetPan?: boolean, resetZoom?: boolean, resetToCenter?: boolean, resetRotation?: boolean, supressEvents?: boolean): boolean;
    resetSlabThickness(): void;
    setBlendMode(blendMode: BlendModes, filterActorUIDs?: Array<string>, immediate?: boolean): void;
    setSlabThickness(slabThickness: number, filterActorUIDs?: Array<string>): void;
    getSlabThickness(): number;
    getImageData(volumeId?: string): IImageData | undefined;
    setOrientation(orientation: OrientationAxis): void;
}
//# sourceMappingURL=IVolumeViewport.d.ts.map