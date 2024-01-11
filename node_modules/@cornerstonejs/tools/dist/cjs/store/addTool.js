"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTool = exports.addTool = void 0;
const state_1 = require("./state");
function addTool(ToolClass) {
    const toolName = ToolClass.toolName;
    const toolAlreadyAdded = state_1.state.tools[toolName] !== undefined;
    if (!toolName) {
        throw new Error(`No Tool Found for the ToolClass ${ToolClass.name}`);
    }
    if (toolAlreadyAdded) {
        throw new Error(`${toolName} has already been added globally`);
    }
    state_1.state.tools[toolName] = {
        toolClass: ToolClass,
    };
}
exports.addTool = addTool;
function removeTool(ToolClass) {
    const toolName = ToolClass.toolName;
    if (!toolName) {
        throw new Error(`No tool found for: ${ToolClass.name}`);
    }
    if (!state_1.state.tools[toolName] !== undefined) {
        delete state_1.state.tools[toolName];
    }
    else {
        throw new Error(`${toolName} cannot be removed because it has not been added`);
    }
}
exports.removeTool = removeTool;
exports.default = addTool;
//# sourceMappingURL=addTool.js.map