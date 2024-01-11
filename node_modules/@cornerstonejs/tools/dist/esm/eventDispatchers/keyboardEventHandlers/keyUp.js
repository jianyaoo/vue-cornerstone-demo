import { resetModifierKey } from '../../eventListeners/keyboard/keyDownListener';
import { ToolGroupManager } from '../../store';
import getActiveToolForKeyboardEvent from '../shared/getActiveToolForKeyboardEvent';
export default function keyUp(evt) {
    const activeTool = getActiveToolForKeyboardEvent(evt);
    if (!activeTool) {
        return;
    }
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    resetModifierKey();
    const toolName = activeTool.getToolName();
    if (Object.keys(toolGroup.toolOptions).includes(toolName)) {
        toolGroup.setViewportsCursorByToolName(toolName);
    }
}
//# sourceMappingURL=keyUp.js.map