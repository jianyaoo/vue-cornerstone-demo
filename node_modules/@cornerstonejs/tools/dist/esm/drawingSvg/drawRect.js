import _getHash from './_getHash';
import setAttributesIfNecessary from './setAttributesIfNecessary';
import setNewAttributesIfValid from './setNewAttributesIfValid';
export default function drawRect(svgDrawingHelper, annotationUID, rectangleUID, start, end, options = {}, dataId = '') {
    const { color, width: _width, lineWidth, lineDash, } = Object.assign({
        color: 'dodgerblue',
        width: '2',
        lineWidth: undefined,
        lineDash: undefined,
    }, options);
    const strokeWidth = lineWidth || _width;
    const svgns = 'http://www.w3.org/2000/svg';
    const svgNodeHash = _getHash(annotationUID, 'rect', rectangleUID);
    const existingRect = svgDrawingHelper.getSvgNode(svgNodeHash);
    const tlhc = [Math.min(start[0], end[0]), Math.min(start[1], end[1])];
    const width = Math.abs(start[0] - end[0]);
    const height = Math.abs(start[1] - end[1]);
    const attributes = {
        x: `${tlhc[0]}`,
        y: `${tlhc[1]}`,
        width: `${width}`,
        height: `${height}`,
        stroke: color,
        fill: 'transparent',
        'stroke-width': strokeWidth,
        'stroke-dasharray': lineDash,
    };
    if (existingRect) {
        setAttributesIfNecessary(attributes, existingRect);
        svgDrawingHelper.setNodeTouched(svgNodeHash);
    }
    else {
        const svgRectElement = document.createElementNS(svgns, 'rect');
        if (dataId !== '') {
            svgRectElement.setAttribute('data-id', dataId);
        }
        setNewAttributesIfValid(attributes, svgRectElement);
        svgDrawingHelper.appendNode(svgRectElement, svgNodeHash);
    }
}
//# sourceMappingURL=drawRect.js.map