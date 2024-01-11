"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getIntersectionWithPolyline_1 = require("./getIntersectionWithPolyline");
function pointInPolyline(points, point, pointEnd) {
    const intersections = (0, getIntersectionWithPolyline_1.getAllIntersectionsWithPolyline)(points, point, [
        point[0],
        pointEnd[1],
    ]);
    if (intersections.length % 2 === 0) {
        return false;
    }
    return true;
}
exports.default = pointInPolyline;
//# sourceMappingURL=pointInPolyline.js.map