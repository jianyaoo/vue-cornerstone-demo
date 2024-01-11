"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _getHash_1 = __importDefault(require("./_getHash"));
const setAttributesIfNecessary_1 = __importDefault(require("./setAttributesIfNecessary"));
const setNewAttributesIfValid_1 = __importDefault(require("./setNewAttributesIfValid"));
function drawRect(svgDrawingHelper, annotationUID, rectangleUID, start, end, options = {}, dataId = '') {
    const { color, width: _width, lineWidth, lineDash, } = Object.assign({
        color: 'dodgerblue',
        width: '2',
        lineWidth: undefined,
        lineDash: undefined,
    }, options);
    const strokeWidth = lineWidth || _width;
    const svgns = 'http://www.w3.org/2000/svg';
    const svgNodeHash = (0, _getHash_1.default)(annotationUID, 'rect', rectangleUID);
    const existingRect = svgDrawingHelper.getSvgNode(svgNodeHash);
    const tlhc = [Math.min(start[0], end[0]), Math.min(start[1], end[1])];
    const width = Math.abs(start[0] - end[0]);
    const height = Math.abs(start[1] - end[1]);
    const attributes = {
        x: `${tlhc[0]}`,
        y: `${tlhc[1]}`,
        width: `${width}`,
        height: `${height}`,
        stroke: color,
        fill: 'transparent',
        'stroke-width': strokeWidth,
        'stroke-dasharray': lineDash,
    };
    if (existingRect) {
        (0, setAttributesIfNecessary_1.default)(attributes, existingRect);
        svgDrawingHelper.setNodeTouched(svgNodeHash);
    }
    else {
        const svgRectElement = document.createElementNS(svgns, 'rect');
        if (dataId !== '') {
            svgRectElement.setAttribute('data-id', dataId);
        }
        (0, setNewAttributesIfValid_1.default)(attributes, svgRectElement);
        svgDrawingHelper.appendNode(svgRectElement, svgNodeHash);
    }
}
exports.default = drawRect;
//# sourceMappingURL=drawRect.js.map