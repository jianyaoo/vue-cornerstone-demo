import { ToolGroupManager } from '../../store';
import { ToolModes } from '../../enums';
import getMouseModifier from './getMouseModifier';
import { keyEventListener } from '../../eventListeners';
const { Active } = ToolModes;
export default function getActiveToolForTouchEvent(evt) {
    const { renderingEngineId, viewportId } = evt.detail;
    const touchEvent = evt.detail.event;
    const toolGroup = ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
        return null;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const numTouchPoints = Object.keys(touchEvent.touches).length;
    const modifierKey = getMouseModifier(touchEvent) || keyEventListener.getModifierKey();
    const defaultMousePrimary = toolGroup.getDefaultMousePrimary();
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        const correctBinding = toolOptions.bindings.length &&
            toolOptions.bindings.some((binding) => (binding.numTouchPoints === numTouchPoints ||
                (numTouchPoints === 1 &&
                    binding.mouseButton === defaultMousePrimary)) &&
                binding.modifierKey === modifierKey);
        if (toolOptions.mode === Active && correctBinding) {
            return toolGroup.getToolInstance(toolName);
        }
    }
}
//# sourceMappingURL=getActiveToolForTouchEvent.js.map