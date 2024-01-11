import _getHash from './_getHash';
import setNewAttributesIfValid from './setNewAttributesIfValid';
import setAttributesIfNecessary from './setAttributesIfNecessary';
export default function drawPolyline(svgDrawingHelper, annotationUID, polylineUID, points, options) {
    if (points.length < 2) {
        return;
    }
    const { fillColor, fillOpacity, color, width, lineWidth, lineDash } = Object.assign({
        color: 'dodgerblue',
        width: '2',
        fillColor: 'none',
        fillOpacity: 0,
        lineWidth: undefined,
        lineDash: undefined,
        connectLastToFirst: false,
    }, options);
    const strokeWidth = lineWidth || width;
    const svgns = 'http://www.w3.org/2000/svg';
    const svgNodeHash = _getHash(annotationUID, 'polyline', polylineUID);
    const existingPolyLine = svgDrawingHelper.getSvgNode(svgNodeHash);
    let pointsAttribute = '';
    for (const point of points) {
        pointsAttribute += `${point[0]}, ${point[1]} `;
    }
    if (options.connectLastToFirst) {
        const firstPoint = points[0];
        pointsAttribute += `${firstPoint[0]}, ${firstPoint[1]}`;
    }
    const attributes = {
        points: pointsAttribute,
        stroke: color,
        fill: fillColor,
        'fill-opacity': fillOpacity,
        'stroke-width': strokeWidth,
        'stroke-dasharray': lineDash,
    };
    if (existingPolyLine) {
        setAttributesIfNecessary(attributes, existingPolyLine);
        svgDrawingHelper.setNodeTouched(svgNodeHash);
    }
    else {
        const newPolyLine = document.createElementNS(svgns, 'polyline');
        setNewAttributesIfValid(attributes, newPolyLine);
        svgDrawingHelper.appendNode(newPolyLine, svgNodeHash);
    }
}
//# sourceMappingURL=drawPolyline.js.map