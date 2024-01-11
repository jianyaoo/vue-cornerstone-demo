import { ToolModes } from '../../enums';
import { ToolAction, EventTypes } from '../../types';
export default function getToolsWithActionsForMouseEvent(evt: EventTypes.MouseMoveEventType, toolModes: ToolModes[]): Map<any, ToolAction>;
