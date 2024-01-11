import { state } from '../../store';
import { ToolModes } from '../../enums';
import { setAnnotationSelected, isAnnotationSelected, } from '../../stateManagement/annotation/annotationSelection';
import { isAnnotationLocked } from '../../stateManagement/annotation/annotationLocking';
import { isAnnotationVisible } from '../../stateManagement/annotation/annotationVisibility';
import filterToolsWithMoveableHandles from '../../store/filterToolsWithMoveableHandles';
import filterToolsWithAnnotationsForElement from '../../store/filterToolsWithAnnotationsForElement';
import filterMoveableAnnotationTools from '../../store/filterMoveableAnnotationTools';
import getActiveToolForTouchEvent from '../shared/getActiveToolForTouchEvent';
import getToolsWithModesForTouchEvent from '../shared/getToolsWithModesForTouchEvent';
const { Active, Passive } = ToolModes;
export default function touchStart(evt) {
    if (state.isInteractingWithTool) {
        return;
    }
    const activeTool = getActiveToolForTouchEvent(evt);
    if (activeTool && typeof activeTool.preTouchStartCallback === 'function') {
        const consumedEvent = activeTool.preTouchStartCallback(evt);
        if (consumedEvent) {
            return;
        }
    }
    const isPrimaryClick = Object.keys(evt.detail.event.touches).length === 1;
    const activeToolsWithEventBinding = getToolsWithModesForTouchEvent(evt, [Active], Object.keys(evt.detail.event.touches).length);
    const passiveToolsIfEventWasPrimaryTouchButton = isPrimaryClick
        ? getToolsWithModesForTouchEvent(evt, [Passive])
        : undefined;
    const applicableTools = [
        ...(activeToolsWithEventBinding || []),
        ...(passiveToolsIfEventWasPrimaryTouchButton || []),
        activeTool,
    ];
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const annotationToolsWithAnnotations = filterToolsWithAnnotationsForElement(element, applicableTools);
    const canvasCoords = eventDetail.currentPoints.canvas;
    const annotationToolsWithMoveableHandles = filterToolsWithMoveableHandles(element, annotationToolsWithAnnotations, canvasCoords, 'touch');
    const isMultiSelect = false;
    if (annotationToolsWithMoveableHandles.length > 0) {
        const { tool, annotation, handle } = getAnnotationForSelection(annotationToolsWithMoveableHandles);
        toggleAnnotationSelection(annotation.annotationUID, isMultiSelect);
        tool.handleSelectedCallback(evt, annotation, handle, 'Touch');
        return;
    }
    const moveableAnnotationTools = filterMoveableAnnotationTools(element, annotationToolsWithAnnotations, canvasCoords, 'touch');
    if (moveableAnnotationTools.length > 0) {
        const { tool, annotation } = getAnnotationForSelection(moveableAnnotationTools);
        toggleAnnotationSelection(annotation.annotationUID, isMultiSelect);
        tool.toolSelectedCallback(evt, annotation, 'Touch');
        return;
    }
    if (activeTool && typeof activeTool.postTouchStartCallback === 'function') {
        const consumedEvent = activeTool.postTouchStartCallback(evt);
        if (consumedEvent) {
            return;
        }
    }
}
function getAnnotationForSelection(toolsWithMovableHandles) {
    return ((toolsWithMovableHandles.length > 1 &&
        toolsWithMovableHandles.find((item) => !isAnnotationLocked(item.annotation) &&
            isAnnotationVisible(item.annotation.annotationUID))) ||
        toolsWithMovableHandles[0]);
}
function toggleAnnotationSelection(annotationUID, isMultiSelect = false) {
    if (isMultiSelect) {
        if (isAnnotationSelected(annotationUID)) {
            setAnnotationSelected(annotationUID, false);
        }
        else {
            const preserveSelected = true;
            setAnnotationSelected(annotationUID, true, preserveSelected);
        }
    }
    else {
        const preserveSelected = false;
        setAnnotationSelected(annotationUID, true, preserveSelected);
    }
}
//# sourceMappingURL=touchStart.js.map