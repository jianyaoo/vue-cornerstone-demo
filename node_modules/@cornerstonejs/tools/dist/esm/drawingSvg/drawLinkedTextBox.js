import drawTextBox from './drawTextBox';
import drawLink from './drawLink';
function drawLinkedTextBox(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, annotationAnchorPoints, textBox, options = {}) {
    const mergedOptions = Object.assign({
        handleRadius: '6',
        centering: {
            x: false,
            y: true,
        },
    }, options);
    const canvasBoundingBox = drawTextBox(svgDrawingHelper, annotationUID, textBoxUID, textLines, textBoxPosition, mergedOptions);
    drawLink(svgDrawingHelper, annotationUID, textBoxUID, annotationAnchorPoints, textBoxPosition, canvasBoundingBox, mergedOptions);
    return canvasBoundingBox;
}
export default drawLinkedTextBox;
//# sourceMappingURL=drawLinkedTextBox.js.map