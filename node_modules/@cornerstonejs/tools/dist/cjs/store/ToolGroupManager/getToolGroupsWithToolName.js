"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const enums_1 = require("../../enums");
const MODES = [enums_1.ToolModes.Active, enums_1.ToolModes.Passive, enums_1.ToolModes.Enabled];
function getToolGroupsWithToolName(toolName) {
    return index_1.state.toolGroups.filter(({ toolOptions }) => {
        const toolGroupToolNames = Object.keys(toolOptions);
        for (let i = 0; i < toolGroupToolNames.length; i++) {
            if (toolName !== toolGroupToolNames[i]) {
                continue;
            }
            if (!toolOptions[toolName]) {
                continue;
            }
            if (MODES.includes(toolOptions[toolName].mode)) {
                return true;
            }
        }
        return false;
    });
}
exports.default = getToolGroupsWithToolName;
//# sourceMappingURL=getToolGroupsWithToolName.js.map