import { ToolGroupManager } from '../../store';
import { ToolModes } from '../../enums';
import { keyEventListener } from '../../eventListeners';
import getMouseModifier from './getMouseModifier';
const { Active } = ToolModes;
export default function getActiveToolForMouseEvent(evt) {
    const { renderingEngineId, viewportId } = evt.detail;
    const mouseEvent = evt.detail.event;
    const modifierKey = getMouseModifier(mouseEvent) || keyEventListener.getModifierKey();
    const toolGroup = ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
        return null;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const defaultMousePrimary = toolGroup.getDefaultMousePrimary();
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        const correctBinding = toolOptions.bindings.length &&
            toolOptions.bindings.some((binding) => {
                return (binding.mouseButton ===
                    (mouseEvent ? mouseEvent.buttons : defaultMousePrimary) &&
                    binding.modifierKey === modifierKey);
            });
        if (toolOptions.mode === Active && correctBinding) {
            return toolGroup.getToolInstance(toolName);
        }
    }
}
//# sourceMappingURL=getActiveToolForMouseEvent.js.map