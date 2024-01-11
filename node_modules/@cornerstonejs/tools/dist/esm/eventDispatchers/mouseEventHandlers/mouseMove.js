import { state } from '../../store';
import { ToolModes } from '../../enums';
import filterToolsWithAnnotationsForElement from '../../store/filterToolsWithAnnotationsForElement';
import getToolsWithModesForMouseEvent from '../shared/getToolsWithModesForMouseEvent';
import triggerAnnotationRender from '../../utilities/triggerAnnotationRender';
const { Active, Passive } = ToolModes;
export default function mouseMove(evt) {
    if (state.isInteractingWithTool || state.isMultiPartToolActive) {
        return;
    }
    const activeAndPassiveTools = getToolsWithModesForMouseEvent(evt, [
        Active,
        Passive,
    ]);
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const toolsWithAnnotations = filterToolsWithAnnotationsForElement(element, activeAndPassiveTools);
    const toolsWithoutAnnotations = activeAndPassiveTools.filter((tool) => {
        const doesNotHaveAnnotations = !toolsWithAnnotations.some((toolAndAnnotation) => toolAndAnnotation.tool.getToolName() === tool.getToolName());
        return doesNotHaveAnnotations;
    });
    let annotationsNeedToBeRedrawn = false;
    for (const { tool, annotations } of toolsWithAnnotations) {
        if (typeof tool.mouseMoveCallback === 'function') {
            annotationsNeedToBeRedrawn =
                tool.mouseMoveCallback(evt, annotations) || annotationsNeedToBeRedrawn;
        }
    }
    toolsWithoutAnnotations.forEach((tool) => {
        if (typeof tool.mouseMoveCallback === 'function') {
            tool.mouseMoveCallback(evt);
        }
    });
    if (annotationsNeedToBeRedrawn === true) {
        triggerAnnotationRender(element);
    }
}
//# sourceMappingURL=mouseMove.js.map