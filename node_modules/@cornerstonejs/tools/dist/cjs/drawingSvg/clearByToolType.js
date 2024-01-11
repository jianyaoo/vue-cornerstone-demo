"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getSvgDrawingHelper_1 = __importDefault(require("./getSvgDrawingHelper"));
function clearByToolType(element, toolType) {
    const svgDrawingHelper = (0, getSvgDrawingHelper_1.default)(element);
    const nodes = svgDrawingHelper.svgLayerElement.querySelectorAll('svg > *');
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const toolUID = node.dataset.toolUid;
        if (toolUID === toolType) {
            svgDrawingHelper.svgLayerElement.removeChild(node);
        }
    }
}
exports.default = clearByToolType;
//# sourceMappingURL=clearByToolType.js.map