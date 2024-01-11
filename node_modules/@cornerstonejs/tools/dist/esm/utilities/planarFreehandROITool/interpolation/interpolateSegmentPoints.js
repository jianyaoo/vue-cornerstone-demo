import { interpolatePoints } from './algorithms/bspline';
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
export default function interpolateSegmentPoints(points, iniIndex, endIndex, knotsRatioPercentage) {
    const segmentSize = endIndex - iniIndex + 1;
    const amountOfKnots = Math.floor((knotsRatioPercentage / 100) * segmentSize) ?? 1;
    const minKnotDistance = Math.floor(segmentSize / amountOfKnots) ?? 1;
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
    const interpolatedPoints = interpolatePoints(points, knotsIndexes);
    return [
        ...segmentPointsUnchangedBeg,
        ...interpolatedPoints,
        ...segmentPointsUnchangedEnd,
    ];
}
//# sourceMappingURL=interpolateSegmentPoints.js.map