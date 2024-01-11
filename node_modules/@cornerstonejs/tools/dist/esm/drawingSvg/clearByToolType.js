import getSvgDrawingHelper from './getSvgDrawingHelper';
function clearByToolType(element, toolType) {
    const svgDrawingHelper = getSvgDrawingHelper(element);
    const nodes = svgDrawingHelper.svgLayerElement.querySelectorAll('svg > *');
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const toolUID = node.dataset.toolUid;
        if (toolUID === toolType) {
            svgDrawingHelper.svgLayerElement.removeChild(node);
        }
    }
}
export default clearByToolType;
//# sourceMappingURL=clearByToolType.js.map