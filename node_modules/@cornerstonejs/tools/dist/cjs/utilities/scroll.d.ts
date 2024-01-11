import { Types, VolumeViewport } from '@cornerstonejs/core';
import { ScrollOptions } from '../types';
export default function scroll(viewport: Types.IViewport, options: ScrollOptions): void;
export declare function scrollVolume(viewport: VolumeViewport, volumeId: string, delta: number, scrollSlabs?: boolean): void;
