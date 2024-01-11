"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const store_1 = require("../../store");
const enums_1 = require("../../enums");
const filterToolsWithAnnotationsForElement_1 = __importDefault(require("../../store/filterToolsWithAnnotationsForElement"));
const filterMoveableAnnotationTools_1 = __importDefault(require("../../store/filterMoveableAnnotationTools"));
const getToolsWithActionsForMouseEvent_1 = __importDefault(require("../shared/getToolsWithActionsForMouseEvent"));
const { Active, Passive } = enums_1.ToolModes;
function mouseDownAnnotationAction(evt) {
    if (store_1.state.isInteractingWithTool) {
        return false;
    }
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { canvas: canvasCoords } = eventDetail.currentPoints;
    if (!enabledElement) {
        return false;
    }
    const toolsWithActions = (0, getToolsWithActionsForMouseEvent_1.default)(evt, [
        Active,
        Passive,
    ]);
    const tools = Array.from(toolsWithActions.keys());
    const annotationToolsWithAnnotations = (0, filterToolsWithAnnotationsForElement_1.default)(element, tools);
    const moveableAnnotationTools = (0, filterMoveableAnnotationTools_1.default)(element, annotationToolsWithAnnotations, canvasCoords);
    if (moveableAnnotationTools.length > 0) {
        const { tool, annotation } = moveableAnnotationTools[0];
        const action = toolsWithActions.get(tool);
        const method = typeof action.method === 'string' ? tool[action.method] : action.method;
        method.call(tool, evt, annotation);
        return true;
    }
    return false;
}
exports.default = mouseDownAnnotationAction;
//# sourceMappingURL=mouseDownAnnotationAction.js.map