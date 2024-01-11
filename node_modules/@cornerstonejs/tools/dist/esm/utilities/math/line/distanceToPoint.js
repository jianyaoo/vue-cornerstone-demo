import distanceToPointSquared from './distanceToPointSquared';
export default function distanceToPoint(lineStart, lineEnd, point) {
    if (lineStart.length !== 2 || lineEnd.length !== 2 || point.length !== 2) {
        throw Error('lineStart, lineEnd, and point should have 2 elements of [x, y]');
    }
    return Math.sqrt(distanceToPointSquared(lineStart, lineEnd, point));
}
//# sourceMappingURL=distanceToPoint.js.map