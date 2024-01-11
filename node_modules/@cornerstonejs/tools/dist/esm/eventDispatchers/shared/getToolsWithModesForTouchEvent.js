import { ToolGroupManager } from '../../store';
export default function getToolsWithModesForTouchEvent(evt, modesFilter, numTouchPoints) {
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
        const correctBinding = numTouchPoints != null &&
            tool.bindings.length &&
            tool.bindings.some((binding) => binding.numTouchPoints === numTouchPoints);
        if (modesFilter.includes(tool.mode) &&
            (!numTouchPoints || correctBinding)) {
            const toolInstance = toolGroup.getToolInstance(toolName);
            enabledTools.push(toolInstance);
        }
    }
    return enabledTools;
}
//# sourceMappingURL=getToolsWithModesForTouchEvent.js.map