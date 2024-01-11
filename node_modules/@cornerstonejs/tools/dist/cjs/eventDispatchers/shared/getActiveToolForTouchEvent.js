"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
const enums_1 = require("../../enums");
const getMouseModifier_1 = __importDefault(require("./getMouseModifier"));
const eventListeners_1 = require("../../eventListeners");
const { Active } = enums_1.ToolModes;
function getActiveToolForTouchEvent(evt) {
    const { renderingEngineId, viewportId } = evt.detail;
    const touchEvent = evt.detail.event;
    const toolGroup = store_1.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
        return null;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const numTouchPoints = Object.keys(touchEvent.touches).length;
    const modifierKey = (0, getMouseModifier_1.default)(touchEvent) || eventListeners_1.keyEventListener.getModifierKey();
    const defaultMousePrimary = toolGroup.getDefaultMousePrimary();
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        const correctBinding = toolOptions.bindings.length &&
            toolOptions.bindings.some((binding) => (binding.numTouchPoints === numTouchPoints ||
                (numTouchPoints === 1 &&
                    binding.mouseButton === defaultMousePrimary)) &&
                binding.modifierKey === modifierKey);
        if (toolOptions.mode === Active && correctBinding) {
            return toolGroup.getToolInstance(toolName);
        }
    }
}
exports.default = getActiveToolForTouchEvent;
//# sourceMappingURL=getActiveToolForTouchEvent.js.map