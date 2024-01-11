"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
const enums_1 = require("../../enums");
const { Active, Passive, Enabled } = enums_1.ToolModes;
function filterViewportsWithToolEnabled(viewports, toolName) {
    const numViewports = viewports.length;
    const viewportsWithToolEnabled = [];
    for (let vp = 0; vp < numViewports; vp++) {
        const viewport = viewports[vp];
        const toolGroup = store_1.ToolGroupManager.getToolGroupForViewport(viewport.id, viewport.renderingEngineId);
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
exports.default = filterViewportsWithToolEnabled;
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