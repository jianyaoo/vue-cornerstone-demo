import { ToolModes } from '../../enums';
import { EventTypes } from '../../types';
declare type ModesFilter = Array<ToolModes>;
export default function getToolsWithModesForTouchEvent(evt: EventTypes.NormalizedTouchEventType, modesFilter: ModesFilter, numTouchPoints?: number): any[];
export {};
