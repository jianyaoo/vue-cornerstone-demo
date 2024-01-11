import { state } from './state';
export function addTool(ToolClass) {
    const toolName = ToolClass.toolName;
    const toolAlreadyAdded = state.tools[toolName] !== undefined;
    if (!toolName) {
        throw new Error(`No Tool Found for the ToolClass ${ToolClass.name}`);
    }
    if (toolAlreadyAdded) {
        throw new Error(`${toolName} has already been added globally`);
    }
    state.tools[toolName] = {
        toolClass: ToolClass,
    };
}
export function removeTool(ToolClass) {
    const toolName = ToolClass.toolName;
    if (!toolName) {
        throw new Error(`No tool found for: ${ToolClass.name}`);
    }
    if (!state.tools[toolName] !== undefined) {
        delete state.tools[toolName];
    }
    else {
        throw new Error(`${toolName} cannot be removed because it has not been added`);
    }
}
export default addTool;
//# sourceMappingURL=addTool.js.map