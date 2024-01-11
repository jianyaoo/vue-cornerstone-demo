export default function filterToolsWithMoveableHandles(element, ToolAndAnnotations, canvasCoords, interactionType = 'mouse') {
    const proximity = interactionType === 'touch' ? 36 : 6;
    const toolsWithMoveableHandles = [];
    ToolAndAnnotations.forEach(({ tool, annotations }) => {
        for (const annotation of annotations) {
            if (annotation.isLocked || !annotation.isVisible) {
                continue;
            }
            const handle = tool.getHandleNearImagePoint(element, annotation, canvasCoords, proximity);
            if (handle) {
                toolsWithMoveableHandles.push({
                    tool,
                    annotation,
                    handle,
                });
                break;
            }
        }
    });
    return toolsWithMoveableHandles;
}
//# sourceMappingURL=filterToolsWithMoveableHandles.js.map