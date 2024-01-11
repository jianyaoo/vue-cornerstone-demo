export default function getTextBoxCoordsCanvas(annotationCanvasPoints) {
    const corners = _determineCorners(annotationCanvasPoints);
    const centerY = (corners.top[1] + corners.bottom[1]) / 2;
    const textBoxCanvas = [corners.right[0], centerY];
    return textBoxCanvas;
}
function _determineCorners(canvasPoints) {
    const handlesLeftToRight = [canvasPoints[0], canvasPoints[1]].sort(_compareX);
    const handlesTopToBottom = [canvasPoints[0], canvasPoints[1]].sort(_compareY);
    const right = handlesLeftToRight[handlesLeftToRight.length - 1];
    const top = handlesTopToBottom[0];
    const bottom = handlesTopToBottom[handlesTopToBottom.length - 1];
    return {
        top,
        bottom,
        right,
    };
    function _compareX(a, b) {
        return a[0] < b[0] ? -1 : 1;
    }
    function _compareY(a, b) {
        return a[1] < b[1] ? -1 : 1;
    }
}
//# sourceMappingURL=getTextBoxCoordsCanvas.js.map