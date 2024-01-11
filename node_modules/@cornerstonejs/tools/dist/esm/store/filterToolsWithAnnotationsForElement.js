import { getAnnotations } from '../stateManagement/annotation/annotationState';
export default function filterToolsWithAnnotationsForElement(element, tools) {
    const result = [];
    for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        if (!tool) {
            console.warn('undefined tool in filterToolsWithAnnotationsForElement');
            continue;
        }
        let annotations = getAnnotations(tool.constructor.toolName, element);
        if (!annotations?.length) {
            continue;
        }
        if (typeof tool.filterInteractableAnnotationsForElement === 'function') {
            annotations = tool.filterInteractableAnnotationsForElement(element, annotations);
        }
        if (annotations.length > 0) {
            result.push({ tool, annotations });
        }
    }
    return result;
}
//# sourceMappingURL=filterToolsWithAnnotationsForElement.js.map