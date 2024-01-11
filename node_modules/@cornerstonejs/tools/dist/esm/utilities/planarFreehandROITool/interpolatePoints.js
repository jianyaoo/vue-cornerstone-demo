import { point } from '../math';
import interpolateSegmentPoints from './interpolation/interpolateSegmentPoints';
export function shouldInterpolate(configuration) {
    return (configuration?.interpolation?.interpolateOnAdd === true ||
        configuration?.interpolation?.interpolateOnEdit === true);
}
function isEqualByProximity(pointA, pointB) {
    return point.distanceToPoint(pointA, pointB) < 0.001;
}
function isEqual(pointA, pointB) {
    return point.distanceToPoint(pointA, pointB) === 0;
}
function findMatchIndexes(points, otherPoints) {
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < otherPoints.length; j++) {
            if (isEqual(points[i], otherPoints[j])) {
                return [i, j];
            }
        }
    }
}
function followingIndex(index, size, direction) {
    return (index + size + direction) % size;
}
function circularFindNextIndexBy(listParams, otherListParams, criteria, direction) {
    const [, indexDelimiter, points] = listParams;
    const [, otherIndexDelimiter, otherPoints] = otherListParams;
    const pointsLength = points.length;
    const otherPointsLength = otherPoints.length;
    let startIndex = listParams[0];
    let otherStartIndex = otherListParams[0];
    if (!points[startIndex] ||
        !otherPoints[otherStartIndex] ||
        !points[indexDelimiter] ||
        !otherPoints[otherIndexDelimiter]) {
        return [undefined, undefined];
    }
    while (startIndex !== indexDelimiter &&
        otherStartIndex !== otherIndexDelimiter) {
        if (criteria(otherPoints[otherStartIndex], points[startIndex])) {
            return [startIndex, otherStartIndex];
        }
        startIndex = followingIndex(startIndex, pointsLength, direction);
        otherStartIndex = followingIndex(otherStartIndex, otherPointsLength, direction);
    }
    return [undefined, undefined];
}
function findChangedSegment(points, previousPoints) {
    const [firstMatchIndex, previousFirstMatchIndex] = findMatchIndexes(points, previousPoints) || [];
    const toBeNotEqualCriteria = (pointA, pointB) => isEqualByProximity(pointA, pointB) === false;
    const [lowDiffIndex, lowOtherDiffIndex] = circularFindNextIndexBy([
        followingIndex(firstMatchIndex, points.length, 1),
        firstMatchIndex,
        points,
    ], [
        followingIndex(previousFirstMatchIndex, previousPoints.length, 1),
        previousFirstMatchIndex,
        previousPoints,
    ], toBeNotEqualCriteria, 1);
    const [highIndex] = circularFindNextIndexBy([followingIndex(lowDiffIndex, points.length, -1), lowDiffIndex, points], [
        followingIndex(lowOtherDiffIndex, previousPoints.length, -1),
        lowOtherDiffIndex,
        previousPoints,
    ], toBeNotEqualCriteria, -1);
    return [lowDiffIndex, highIndex];
}
export function getInterpolatedPoints(configuration, points, pointsOfReference) {
    const { interpolation } = configuration;
    const result = points;
    if (interpolation) {
        const { knotsRatioPercentageOnAdd, knotsRatioPercentageOnEdit, interpolateOnAdd = false, interpolateOnEdit = false, } = interpolation;
        const knotsRatioPercentage = pointsOfReference
            ? knotsRatioPercentageOnEdit
            : knotsRatioPercentageOnAdd;
        const isEnabled = pointsOfReference ? interpolateOnEdit : interpolateOnAdd;
        if (isEnabled) {
            const [changedIniIndex, changedEndIndex] = pointsOfReference
                ? findChangedSegment(points, pointsOfReference)
                : [0, points.length - 1];
            if (!points[changedIniIndex] || !points[changedEndIndex]) {
                return points;
            }
            return (interpolateSegmentPoints(points, changedIniIndex, changedEndIndex, knotsRatioPercentage));
        }
    }
    return result;
}
//# sourceMappingURL=interpolatePoints.js.map