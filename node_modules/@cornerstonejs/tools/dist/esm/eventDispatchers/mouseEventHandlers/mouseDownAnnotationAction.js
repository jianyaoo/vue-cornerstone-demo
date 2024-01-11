import { getEnabledElement } from '@cornerstonejs/core';
import { state } from '../../store';
import { ToolModes } from '../../enums';
import filterToolsWithAnnotationsForElement from '../../store/filterToolsWithAnnotationsForElement';
import filterMoveableAnnotationTools from '../../store/filterMoveableAnnotationTools';
import getToolsWithActionsForMouseEvent from '../shared/getToolsWithActionsForMouseEvent';
const { Active, Passive } = ToolModes;
export default function mouseDownAnnotationAction(evt) {
    if (state.isInteractingWithTool) {
        return false;
    }
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const enabledElement = getEnabledElement(element);
    const { canvas: canvasCoords } = eventDetail.currentPoints;
    if (!enabledElement) {
        return false;
    }
    const toolsWithActions = getToolsWithActionsForMouseEvent(evt, [
        Active,
        Passive,
    ]);
    const tools = Array.from(toolsWithActions.keys());
    const annotationToolsWithAnnotations = filterToolsWithAnnotationsForElement(element, tools);
    const moveableAnnotationTools = filterMoveableAnnotationTools(element, annotationToolsWithAnnotations, canvasCoords);
    if (moveableAnnotationTools.length > 0) {
        const { tool, annotation } = moveableAnnotationTools[0];
        const action = toolsWithActions.get(tool);
        const method = typeof action.method === 'string' ? tool[action.method] : action.method;
        method.call(tool, evt, annotation);
        return true;
    }
    return false;
}
//# sourceMappingURL=mouseDownAnnotationAction.js.map