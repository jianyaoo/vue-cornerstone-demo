"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drawLine_1 = __importDefault(require("./drawLine"));
const findClosestPoint_1 = __importDefault(require("../utilities/math/vec2/findClosestPoint"));
function drawLink(svgDrawingHelper, annotationUID, linkUID, annotationAnchorPoints, refPoint, boundingBox, options = {}) {
    const start = annotationAnchorPoints.length > 0
        ? (0, findClosestPoint_1.default)(annotationAnchorPoints, refPoint)
        : refPoint;
    const boundingBoxPoints = _boundingBoxPoints(boundingBox);
    const end = (0, findClosestPoint_1.default)(boundingBoxPoints, start);
    const mergedOptions = Object.assign({
        color: 'rgb(255, 255, 0)',
        lineWidth: '1',
        lineDash: '2,3',
    }, options);
    (0, drawLine_1.default)(svgDrawingHelper, annotationUID, `link-${linkUID}`, start, end, mergedOptions);
}
function _boundingBoxPoints(boundingBox) {
    const { x: left, y: top, height, width } = boundingBox;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const topMiddle = [left + halfWidth, top];
    const leftMiddle = [left, top + halfHeight];
    const bottomMiddle = [left + halfWidth, top + height];
    const rightMiddle = [left + width, top + halfHeight];
    return [topMiddle, leftMiddle, bottomMiddle, rightMiddle];
}
exports.default = drawLink;
//# sourceMappingURL=drawLink.js.map