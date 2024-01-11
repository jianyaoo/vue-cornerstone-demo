"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
const enums_1 = require("../../enums");
const eventListeners_1 = require("../../eventListeners");
const getMouseModifier_1 = __importDefault(require("./getMouseModifier"));
const { Active } = enums_1.ToolModes;
function getActiveToolForMouseEvent(evt) {
    const { renderingEngineId, viewportId } = evt.detail;
    const mouseEvent = evt.detail.event;
    const modifierKey = (0, getMouseModifier_1.default)(mouseEvent) || eventListeners_1.keyEventListener.getModifierKey();
    const toolGroup = store_1.ToolGroupManager.getToolGroupForViewport(viewportId, renderingEngineId);
    if (!toolGroup) {
        return null;
    }
    const toolGroupToolNames = Object.keys(toolGroup.toolOptions);
    const defaultMousePrimary = toolGroup.getDefaultMousePrimary();
    for (let j = 0; j < toolGroupToolNames.length; j++) {
        const toolName = toolGroupToolNames[j];
        const toolOptions = toolGroup.toolOptions[toolName];
        const correctBinding = toolOptions.bindings.length &&
            toolOptions.bindings.some((binding) => {
                return (binding.mouseButton ===
                    (mouseEvent ? mouseEvent.buttons : defaultMousePrimary) &&
                    binding.modifierKey === modifierKey);
            });
        if (toolOptions.mode === Active && correctBinding) {
            return toolGroup.getToolInstance(toolName);
        }
    }
}
exports.default = getActiveToolForMouseEvent;
//# sourceMappingURL=getActiveToolForMouseEvent.js.map