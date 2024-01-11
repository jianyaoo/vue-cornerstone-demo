import drawLine from './drawLine';
import findClosestPoint from '../utilities/math/vec2/findClosestPoint';
function drawLink(svgDrawingHelper, annotationUID, linkUID, annotationAnchorPoints, refPoint, boundingBox, options = {}) {
    const start = annotationAnchorPoints.length > 0
        ? findClosestPoint(annotationAnchorPoints, refPoint)
        : refPoint;
    const boundingBoxPoints = _boundingBoxPoints(boundingBox);
    const end = findClosestPoint(boundingBoxPoints, start);
    const mergedOptions = Object.assign({
        color: 'rgb(255, 255, 0)',
        lineWidth: '1',
        lineDash: '2,3',
    }, options);
    drawLine(svgDrawingHelper, annotationUID, `link-${linkUID}`, start, end, mergedOptions);
}
function _boundingBoxPoints(boundingBox) {
    const { x: left, y: top, height, width } = boundingBox;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const topMiddle = [left + halfWidth, top];
    const leftMiddle = [left, top + halfHeight];
    const bottomMiddle = [left + halfWidth, top + height];
    const rightMiddle = [left + width, top + halfHeight];
    return [topMiddle, leftMiddle, bottomMiddle, rightMiddle];
}
export default drawLink;
//# sourceMappingURL=drawLink.js.map