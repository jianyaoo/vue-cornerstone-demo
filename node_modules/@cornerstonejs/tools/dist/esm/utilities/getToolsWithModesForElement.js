import { ToolGroupManager } from '../store';
import { getEnabledElement } from '@cornerstonejs/core';
export default function getToolsWithModesForElement(element, modesFilter) {
    const enabledElement = getEnabledElement(element);
    const { renderingEngineId, viewportId } = enabledElement;
    const toolGroup = ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
        return [];
    }
    const enabledTools = [];
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        if (!toolOptions) {
            continue;
        }
        if (modesFilter.includes(toolOptions.mode)) {
            const toolInstance = toolGroup.getToolInstance(toolName);
            enabledTools.push(toolInstance);
        }
    }
    return enabledTools;
}
//# sourceMappingURL=getToolsWithModesForElement.js.map