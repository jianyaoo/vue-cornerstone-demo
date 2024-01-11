"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lineSegment = __importStar(require("../line"));
function rectToLineSegments(left, top, width, height) {
    const topLineStart = [left, top];
    const topLineEnd = [left + width, top];
    const rightLineStart = [left + width, top];
    const rightLineEnd = [left + width, top + height];
    const bottomLineStart = [left + width, top + height];
    const bottomLineEnd = [left, top + height];
    const leftLineStart = [left, top + height];
    const leftLineEnd = [left, top];
    const lineSegments = {
        top: [topLineStart, topLineEnd],
        right: [rightLineStart, rightLineEnd],
        bottom: [bottomLineStart, bottomLineEnd],
        left: [leftLineStart, leftLineEnd],
    };
    return lineSegments;
}
function distanceToPoint(rect, point) {
    if (rect.length !== 4 || point.length !== 2) {
        throw Error('rectangle:[left, top, width, height] or point: [x,y] not defined correctly');
    }
    const [left, top, width, height] = rect;
    let minDistance = 655535;
    const lineSegments = rectToLineSegments(left, top, width, height);
    Object.keys(lineSegments).forEach((segment) => {
        const [lineStart, lineEnd] = lineSegments[segment];
        const distance = lineSegment.distanceToPoint(lineStart, lineEnd, point);
        if (distance < minDistance) {
            minDistance = distance;
        }
    });
    return minDistance;
}
exports.default = distanceToPoint;
//# sourceMappingURL=distanceToPoint.js.map