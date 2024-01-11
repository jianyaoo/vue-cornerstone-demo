"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drawTextBox_1 = __importDefault(require("./drawTextBox"));
const drawLink_1 = __importDefault(require("./drawLink"));
function drawLinkedTextBox(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, annotationAnchorPoints, textBox, options = {}) {
    const mergedOptions = Object.assign({
        handleRadius: '6',
        centering: {
            x: false,
            y: true,
        },
    }, options);
    const canvasBoundingBox = (0, drawTextBox_1.default)(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, mergedOptions);
    (0, drawLink_1.default)(svgDrawingHelper, annotationUID, textBoxUID, annotationAnchorPoints, textBoxPosition, canvasBoundingBox, mergedOptions);
    return canvasBoundingBox;
}
exports.default = drawLinkedTextBox;
//# sourceMappingURL=drawLinkedTextBox.js.map