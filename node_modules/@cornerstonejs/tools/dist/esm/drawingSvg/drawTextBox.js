import _getHash from './_getHash';
import setAttributesIfNecessary from './setAttributesIfNecessary';
function drawTextBox(svgDrawingHelper, annotationUID, textUID, textLines, position, options = {}) {
    const mergedOptions = Object.assign({
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '14px',
        color: 'rgb(255, 255, 0)',
        background: '',
        padding: 25,
        centerX: false,
        centerY: true,
    }, options);
    const textGroupBoundingBox = _drawTextGroup(svgDrawingHelper, annotationUID, textUID, textLines, position, mergedOptions);
    return textGroupBoundingBox;
}
function _drawTextGroup(svgDrawingHelper, annotationUID, textUID, textLines = [''], position, options) {
    const { padding, color, fontFamily, fontSize, background } = options;
    let textGroupBoundingBox;
    const [x, y] = [position[0] + padding, position[1] + padding];
    const svgns = 'http://www.w3.org/2000/svg';
    const svgNodeHash = _getHash(annotationUID, 'text', textUID);
    const existingTextGroup = svgDrawingHelper.getSvgNode(svgNodeHash);
    if (existingTextGroup) {
        const textElement = existingTextGroup.querySelector('text');
        const textSpans = Array.from(textElement.children);
        for (let i = 0; i < textSpans.length; i++) {
            const textSpanElement = textSpans[i];
            const text = textLines[i] || '';
            textSpanElement.textContent = text;
        }
        if (textLines.length > textSpans.length) {
            for (let i = 0; i < textLines.length - textSpans.length; i++) {
                const textLine = textLines[i + textSpans.length];
                const textSpan = _createTextSpan(textLine);
                textElement.appendChild(textSpan);
            }
            existingTextGroup.appendChild(textElement);
            svgDrawingHelper.appendNode(existingTextGroup, svgNodeHash);
        }
        const textAttributes = {
            fill: color,
            'font-size': fontSize,
            'font-family': fontFamily,
        };
        const textGroupAttributes = {
            transform: `translate(${x} ${y})`,
        };
        setAttributesIfNecessary(textAttributes, textElement);
        setAttributesIfNecessary(textGroupAttributes, existingTextGroup);
        textGroupBoundingBox = _drawTextBackground(existingTextGroup, background);
        svgDrawingHelper.setNodeTouched(svgNodeHash);
    }
    else {
        const textGroup = document.createElementNS(svgns, 'g');
        textGroup.setAttribute('transform', `translate(${x} ${y})`);
        const textElement = _createTextElement(svgDrawingHelper, options);
        for (let i = 0; i < textLines.length; i++) {
            const textLine = textLines[i];
            const textSpan = _createTextSpan(textLine);
            textElement.appendChild(textSpan);
        }
        textGroup.appendChild(textElement);
        svgDrawingHelper.appendNode(textGroup, svgNodeHash);
        textGroupBoundingBox = _drawTextBackground(textGroup, background);
    }
    return Object.assign({}, textGroupBoundingBox, {
        x,
        y,
        height: textGroupBoundingBox.height + padding,
        width: textGroupBoundingBox.width + padding,
    });
}
function _createTextElement(svgDrawingHelper, options) {
    const { color, fontFamily, fontSize } = options;
    const svgns = 'http://www.w3.org/2000/svg';
    const textElement = document.createElementNS(svgns, 'text');
    const noSelectStyle = 'user-select: none; pointer-events: none; -webkit-tap-highlight-color:  rgba(255, 255, 255, 0);';
    const dropShadowStyle = `filter:url(#shadow-${svgDrawingHelper.svgLayerElement.id});`;
    const combinedStyle = `${noSelectStyle}${dropShadowStyle}`;
    textElement.setAttribute('x', '0');
    textElement.setAttribute('y', '0');
    textElement.setAttribute('fill', color);
    textElement.setAttribute('font-family', fontFamily);
    textElement.setAttribute('font-size', fontSize);
    textElement.setAttribute('style', combinedStyle);
    return textElement;
}
function _createTextSpan(text) {
    const svgns = 'http://www.w3.org/2000/svg';
    const textSpanElement = document.createElementNS(svgns, 'tspan');
    textSpanElement.setAttribute('x', '0');
    textSpanElement.setAttribute('dy', '1.2em');
    textSpanElement.textContent = text;
    return textSpanElement;
}
function _drawTextBackground(group, color) {
    let element = group.querySelector('rect.background');
    if (!color) {
        if (element) {
            group.removeChild(element);
        }
        return group.getBBox();
    }
    if (!element) {
        element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        element.setAttribute('class', 'background');
        group.insertBefore(element, group.firstChild);
    }
    const bBox = group.getBBox();
    const attributes = {
        x: `${bBox.x}`,
        y: `${bBox.y}`,
        width: `${bBox.width}`,
        height: `${bBox.height}`,
        fill: color,
    };
    setAttributesIfNecessary(attributes, element);
    return bBox;
}
export default drawTextBox;
//# sourceMappingURL=drawTextBox.js.map