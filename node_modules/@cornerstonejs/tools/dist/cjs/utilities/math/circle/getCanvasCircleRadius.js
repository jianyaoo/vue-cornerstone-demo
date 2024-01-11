"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("../point");
function getCanvasCircleRadius(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    return (0, point_1.distanceToPoint)(center, end);
}
exports.default = getCanvasCircleRadius;
//# sourceMappingURL=getCanvasCircleRadius.js.map