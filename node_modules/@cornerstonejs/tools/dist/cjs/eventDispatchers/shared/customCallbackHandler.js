"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
const ToolModes_1 = __importDefault(require("../../enums/ToolModes"));
const { Active } = ToolModes_1.default;
function customCallbackHandler(handlerType, customFunction, evt) {
    if (store_1.state.isInteractingWithTool) {
        return false;
    }
    const { renderingEngineId, viewportId } = evt.detail;
    const toolGroup = store_1.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
        return false;
    }
    let activeTool;
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const tool = toolGroup.toolOptions[toolName];
        const toolInstance = toolGroup.getToolInstance(toolName);
        if (tool.mode === Active &&
            typeof toolInstance[customFunction] === 'function') {
            activeTool = toolGroup.getToolInstance(toolName);
            break;
        }
    }
    if (!activeTool) {
        return;
    }
    activeTool[customFunction](evt);
}
exports.default = customCallbackHandler;
//# sourceMappingURL=customCallbackHandler.js.map