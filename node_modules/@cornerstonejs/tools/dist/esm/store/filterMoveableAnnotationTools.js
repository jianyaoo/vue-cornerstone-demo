export default function filterMoveableAnnotationTools(element, ToolAndAnnotations, canvasCoords, interactionType = 'mouse') {
    const proximity = interactionType === 'touch' ? 36 : 6;
    const moveableAnnotationTools = [];
    ToolAndAnnotations.forEach(({ tool, annotations }) => {
        for (const annotation of annotations) {
            if (annotation.isLocked || !annotation.isVisible) {
                continue;
            }
            const near = tool.isPointNearTool(element, annotation, canvasCoords, proximity, interactionType);
            if (near) {
                moveableAnnotationTools.push({
                    tool,
                    annotation,
                });
                break;
            }
        }
    });
    return moveableAnnotationTools;
}
//# sourceMappingURL=filterMoveableAnnotationTools.js.map