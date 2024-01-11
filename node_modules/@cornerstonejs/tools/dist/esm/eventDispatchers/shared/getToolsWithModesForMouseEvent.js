import { ToolGroupManager } from '../../store';
export default function getToolsWithModesForMouseEvent(evt, modesFilter, evtButton) {
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
        return [];
    }
    const enabledTools = [];
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const tool = toolGroup.toolOptions[toolName];
        const correctBinding = evtButton != null &&
            tool.bindings.length &&
            tool.bindings.some((binding) => binding.mouseButton === evtButton);
        if (modesFilter.includes(tool.mode) &&
            (!evtButton || correctBinding)) {
            const toolInstance = toolGroup.getToolInstance(toolName);
            enabledTools.push(toolInstance);
        }
    }
    return enabledTools;
}
//# sourceMappingURL=getToolsWithModesForMouseEvent.js.map