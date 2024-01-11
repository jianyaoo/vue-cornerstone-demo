"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bspline_1 = require("./algorithms/bspline");
function getContinuousUniformDistributionValues(minDistributionDistance, closedInterval) {
    const result = [];
    const [intervalIni, intervalEnd] = closedInterval;
    const intervalSize = intervalEnd - intervalIni + 1;
    const intensity = Math.floor(intervalSize / minDistributionDistance);
    let x = 0;
    let continuosDistributionValue = Math.round(((intervalSize - 1) / (intensity - 1)) * x) + intervalIni;
    while (continuosDistributionValue <= intervalEnd) {
        result.push(continuosDistributionValue);
        x++;
        continuosDistributionValue =
            Math.round(((intervalSize - 1) / (intensity - 1)) * x) + intervalIni;
    }
    return result;
}
function interpolateSegmentPoints(points, iniIndex, endIndex, knotsRatioPercentage) {
    var _a, _b;
    const segmentSize = endIndex - iniIndex + 1;
    const amountOfKnots = (_a = Math.floor((knotsRatioPercentage / 100) * segmentSize)) !== null && _a !== void 0 ? _a : 1;
    const minKnotDistance = (_b = Math.floor(segmentSize / amountOfKnots)) !== null && _b !== void 0 ? _b : 1;
    if (isNaN(segmentSize) || !segmentSize || !minKnotDistance) {
        return points;
    }
    if (segmentSize / minKnotDistance < 2) {
        return points;
    }
    const interpolationIniIndex = Math.max(0, iniIndex);
    const interpolationEndIndex = Math.min(points.length - 1, endIndex);
    const segmentPointsUnchangedBeg = points.slice(0, interpolationIniIndex);
    const segmentPointsUnchangedEnd = points.slice(interpolationEndIndex + 1, points.length);
    const knotsIndexes = getContinuousUniformDistributionValues(minKnotDistance, [
        interpolationIniIndex,
        interpolationEndIndex,
    ]);
    const interpolatedPoints = (0, bspline_1.interpolatePoints)(points, knotsIndexes);
    return [
        ...segmentPointsUnchangedBeg,
        ...interpolatedPoints,
        ...segmentPointsUnchangedEnd,
    ];
}
exports.default = interpolateSegmentPoints;
//# sourceMappingURL=interpolateSegmentPoints.js.map