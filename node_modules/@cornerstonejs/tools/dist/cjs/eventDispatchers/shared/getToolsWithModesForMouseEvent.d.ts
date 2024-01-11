import { ToolModes } from '../../enums';
import { EventTypes } from '../../types';
declare type ModesFilter = Array<ToolModes>;
export default function getToolsWithModesForMouseEvent(evt: EventTypes.MouseMoveEventType, modesFilter: ModesFilter, evtButton?: any): any[];
export {};
