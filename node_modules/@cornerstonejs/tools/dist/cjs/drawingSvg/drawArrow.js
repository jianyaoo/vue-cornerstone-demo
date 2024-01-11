"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drawLine_1 = __importDefault(require("./drawLine"));
function drawArrow(svgDrawingHelper, annotationUID, arrowUID, start, end, options = {}) {
    if (isNaN(start[0]) || isNaN(start[1]) || isNaN(end[0]) || isNaN(end[1])) {
        return;
    }
    const { color, width, lineWidth, lineDash } = Object.assign({
        color: 'dodgerblue',
        width: '2',
        lineWidth: undefined,
        lineDash: undefined,
    }, options);
    (0, drawLine_1.default)(svgDrawingHelper, annotationUID, arrowUID, start, end, {
        color,
        width,
        lineWidth,
        lineDash,
    });
    const headLength = 10;
    const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
    const firstLine = {
        start: [
            end[0] - headLength * Math.cos(angle - Math.PI / 7),
            end[1] - headLength * Math.sin(angle - Math.PI / 7),
        ],
        end: end,
    };
    const secondLine = {
        start: [
            end[0] - headLength * Math.cos(angle + Math.PI / 7),
            end[1] - headLength * Math.sin(angle + Math.PI / 7),
        ],
        end: end,
    };
    (0, drawLine_1.default)(svgDrawingHelper, annotationUID, '2', firstLine.start, firstLine.end, {
        color,
        width,
        lineWidth,
    });
    (0, drawLine_1.default)(svgDrawingHelper, annotationUID, '3', secondLine.start, secondLine.end, {
        color,
        width,
        lineWidth,
    });
}
exports.default = drawArrow;
//# sourceMappingURL=drawArrow.js.map