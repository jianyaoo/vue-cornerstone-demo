"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findClosestPoint(sourcePoints, targetPoint) {
    let minPoint = [0, 0];
    let minDistance = Number.MAX_SAFE_INTEGER;
    sourcePoints.forEach(function (sourcePoint) {
        const distance = _distanceBetween(targetPoint, sourcePoint);
        if (distance < minDistance) {
            minDistance = distance;
            minPoint = [...sourcePoint];
        }
    });
    return minPoint;
}
exports.default = findClosestPoint;
function _distanceBetween(p1, p2) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
//# sourceMappingURL=findClosestPoint.js.map