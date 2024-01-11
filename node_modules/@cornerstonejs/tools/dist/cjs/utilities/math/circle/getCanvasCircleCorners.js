"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("../point");
function getCanvasCircleCorners(circleCanvasPoints) {
    const [center, end] = circleCanvasPoints;
    const radius = (0, point_1.distanceToPoint)(center, end);
    const topLeft = [center[0] - radius, center[1] - radius];
    const bottomRight = [center[0] + radius, center[1] + radius];
    return [topLeft, bottomRight];
}
exports.default = getCanvasCircleCorners;
//# sourceMappingURL=getCanvasCircleCorners.js.map