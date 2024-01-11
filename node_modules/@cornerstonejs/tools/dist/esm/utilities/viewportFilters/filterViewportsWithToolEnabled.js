import { ToolGroupManager } from '../../store';
import { ToolModes } from '../../enums';
const { Active, Passive, Enabled } = ToolModes;
export default function filterViewportsWithToolEnabled(viewports, toolName) {
    const numViewports = viewports.length;
    const viewportsWithToolEnabled = [];
    for (let vp = 0; vp < numViewports; vp++) {
        const viewport = viewports[vp];
        const toolGroup = ToolGroupManager.getToolGroupForViewport(viewport.id, viewport.renderingEngineId);
        if (!toolGroup) {
            continue;
        }
        const hasTool = _toolGroupHasActiveEnabledOrPassiveTool(toolGroup, toolName);
        if (hasTool) {
            viewportsWithToolEnabled.push(viewport);
        }
    }
    return viewportsWithToolEnabled;
}
function _toolGroupHasActiveEnabledOrPassiveTool(toolGroup, toolName) {
    const { toolOptions } = toolGroup;
    const tool = toolOptions[toolName];
    if (!tool) {
        return false;
    }
    const toolMode = tool.mode;
    return toolMode === Active || toolMode === Passive || toolMode === Enabled;
}
//# sourceMappingURL=filterViewportsWithToolEnabled.js.map