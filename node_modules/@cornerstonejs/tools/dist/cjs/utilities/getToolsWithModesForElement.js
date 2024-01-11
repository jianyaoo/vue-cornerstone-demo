"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../store");
const core_1 = require("@cornerstonejs/core");
function getToolsWithModesForElement(element, modesFilter) {
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { renderingEngineId, viewportId } = enabledElement;
    const toolGroup = store_1.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
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
exports.default = getToolsWithModesForElement;
//# sourceMappingURL=getToolsWithModesForElement.js.map