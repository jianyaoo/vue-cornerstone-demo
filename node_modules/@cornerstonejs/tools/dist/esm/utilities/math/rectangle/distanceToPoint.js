import * as lineSegment from '../line';
function rectToLineSegments(left, top, width, height) {
    const topLineStart = [left, top];
    const topLineEnd = [left + width, top];
    const rightLineStart = [left + width, top];
    const rightLineEnd = [left + width, top + height];
    const bottomLineStart = [left + width, top + height];
    const bottomLineEnd = [left, top + height];
    const leftLineStart = [left, top + height];
    const leftLineEnd = [left, top];
    const lineSegments = {
        top: [topLineStart, topLineEnd],
        right: [rightLineStart, rightLineEnd],
        bottom: [bottomLineStart, bottomLineEnd],
        left: [leftLineStart, leftLineEnd],
    };
    return lineSegments;
}
export default function distanceToPoint(rect, point) {
    if (rect.length !== 4 || point.length !== 2) {
        throw Error('rectangle:[left, top, width, height] or point: [x,y] not defined correctly');
    }
    const [left, top, width, height] = rect;
    let minDistance = 655535;
    const lineSegments = rectToLineSegments(left, top, width, height);
    Object.keys(lineSegments).forEach((segment) => {
        const [lineStart, lineEnd] = lineSegments[segment];
        const distance = lineSegment.distanceToPoint(lineStart, lineEnd, point);
        if (distance < minDistance) {
            minDistance = distance;
        }
    });
    return minDistance;
}
//# sourceMappingURL=distanceToPoint.js.map