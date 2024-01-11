"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
const enums_1 = require("../../enums");
const filterToolsWithAnnotationsForElement_1 = __importDefault(require("../../store/filterToolsWithAnnotationsForElement"));
const getToolsWithModesForMouseEvent_1 = __importDefault(require("../shared/getToolsWithModesForMouseEvent"));
const triggerAnnotationRender_1 = __importDefault(require("../../utilities/triggerAnnotationRender"));
const { Active, Passive } = enums_1.ToolModes;
function mouseMove(evt) {
    if (store_1.state.isInteractingWithTool || store_1.state.isMultiPartToolActive) {
        return;
    }
    const activeAndPassiveTools = (0, getToolsWithModesForMouseEvent_1.default)(evt, [
        Active,
        Passive,
    ]);
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const toolsWithAnnotations = (0, filterToolsWithAnnotationsForElement_1.default)(element, activeAndPassiveTools);
    const toolsWithoutAnnotations = activeAndPassiveTools.filter((tool) => {
        const doesNotHaveAnnotations = !toolsWithAnnotations.some((toolAndAnnotation) => toolAndAnnotation.tool.getToolName() === tool.getToolName());
        return doesNotHaveAnnotations;
    });
    let annotationsNeedToBeRedrawn = false;
    for (const { tool, annotations } of toolsWithAnnotations) {
        if (typeof tool.mouseMoveCallback === 'function') {
            annotationsNeedToBeRedrawn =
                tool.mouseMoveCallback(evt, annotations) || annotationsNeedToBeRedrawn;
        }
    }
    toolsWithoutAnnotations.forEach((tool) => {
        if (typeof tool.mouseMoveCallback === 'function') {
            tool.mouseMoveCallback(evt);
        }
    });
    if (annotationsNeedToBeRedrawn === true) {
        (0, triggerAnnotationRender_1.default)(element);
    }
}
exports.default = mouseMove;
//# sourceMappingURL=mouseMove.js.map