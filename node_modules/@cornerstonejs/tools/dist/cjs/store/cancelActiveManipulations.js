"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const getToolsWithModesForElement_1 = __importDefault(require("../utilities/getToolsWithModesForElement"));
const filterToolsWithAnnotationsForElement_1 = __importDefault(require("./filterToolsWithAnnotationsForElement"));
function cancelActiveManipulations(element) {
    const tools = (0, getToolsWithModesForElement_1.default)(element, [
        enums_1.ToolModes.Active,
        enums_1.ToolModes.Passive,
    ]);
    const toolsWithData = (0, filterToolsWithAnnotationsForElement_1.default)(element, tools);
    for (const { tool } of toolsWithData) {
        const annotationUID = tool.cancel(element);
        if (annotationUID) {
            return annotationUID;
        }
    }
}
exports.default = cancelActiveManipulations;
//# sourceMappingURL=cancelActiveManipulations.js.map