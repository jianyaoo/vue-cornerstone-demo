"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterpolatedPoints = exports.shouldInterpolate = void 0;
const math_1 = require("../math");
const interpolateSegmentPoints_1 = __importDefault(require("./interpolation/interpolateSegmentPoints"));
function shouldInterpolate(configuration) {
    var _a, _b;
    return (((_a = configuration === null || configuration === void 0 ? void 0 : configuration.interpolation) === null || _a === void 0 ? void 0 : _a.interpolateOnAdd) === true ||
        ((_b = configuration === null || configuration === void 0 ? void 0 : configuration.interpolation) === null || _b === void 0 ? void 0 : _b.interpolateOnEdit) === true);
}
exports.shouldInterpolate = shouldInterpolate;
function isEqualByProximity(pointA, pointB) {
    return math_1.point.distanceToPoint(pointA, pointB) < 0.001;
}
function isEqual(pointA, pointB) {
    return math_1.point.distanceToPoint(pointA, pointB) === 0;
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
function getInterpolatedPoints(configuration, points, pointsOfReference) {
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
            return ((0, interpolateSegmentPoints_1.default)(points, changedIniIndex, changedEndIndex, knotsRatioPercentage));
        }
    }
    return result;
}
exports.getInterpolatedPoints = getInterpolatedPoints;
//# sourceMappingURL=interpolatePoints.js.map