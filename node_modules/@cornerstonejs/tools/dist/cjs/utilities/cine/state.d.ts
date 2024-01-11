import { CINETypes } from '../../types';
declare function addToolState(element: HTMLDivElement, data: CINETypes.ToolData): void;
declare function getToolState(element: HTMLDivElement): CINETypes.ToolData | undefined;
export { addToolState, getToolState };
