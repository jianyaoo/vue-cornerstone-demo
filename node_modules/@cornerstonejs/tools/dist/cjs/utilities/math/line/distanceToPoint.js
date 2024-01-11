"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const distanceToPointSquared_1 = __importDefault(require("./distanceToPointSquared"));
function distanceToPoint(lineStart, lineEnd, point) {
    if (lineStart.length !== 2 || lineEnd.length !== 2 || point.length !== 2) {
        throw Error('lineStart, lineEnd, and point should have 2 elements of [x, y]');
    }
    return Math.sqrt((0, distanceToPointSquared_1.default)(lineStart, lineEnd, point));
}
exports.default = distanceToPoint;
//# sourceMappingURL=distanceToPoint.js.map