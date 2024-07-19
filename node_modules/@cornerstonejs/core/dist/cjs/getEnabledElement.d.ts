import { IEnabledElement } from './types';
export default function getEnabledElement(element: HTMLDivElement | undefined): IEnabledElement | undefined;
export declare function getEnabledElementByIds(viewportId: string, renderingEngineId: string): IEnabledElement;
export declare function getEnabledElementByViewportId(viewportId: string): IEnabledElement;
export declare function getEnabledElements(): IEnabledElement[];
