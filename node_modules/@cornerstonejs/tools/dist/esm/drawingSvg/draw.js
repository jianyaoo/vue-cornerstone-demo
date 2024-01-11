import getSvgDrawingHelper from './getSvgDrawingHelper';
function draw(element, fn) {
    const svgDrawingHelper = getSvgDrawingHelper(element);
    fn(svgDrawingHelper);
    svgDrawingHelper.clearUntouched();
}
export default draw;
//# sourceMappingURL=draw.js.map