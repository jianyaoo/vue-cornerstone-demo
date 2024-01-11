import { eventTarget, triggerEvent } from '@cornerstonejs/core';
import { Events } from '../../enums';
import { getAnnotation } from './annotationState';
const selectedAnnotationUIDs = new Set();
function setAnnotationSelected(annotationUID, selected = true, preserveSelected = false) {
    if (selected) {
        selectAnnotation(annotationUID, preserveSelected);
    }
    else {
        deselectAnnotation(annotationUID);
    }
}
function selectAnnotation(annotationUID, preserveSelected = false) {
    const detail = makeEventDetail();
    if (!preserveSelected) {
        clearSelectionSet(selectedAnnotationUIDs, detail);
    }
    if (annotationUID && !selectedAnnotationUIDs.has(annotationUID)) {
        selectedAnnotationUIDs.add(annotationUID);
        detail.added.push(annotationUID);
    }
    publish(detail, selectedAnnotationUIDs);
}
function deselectAnnotation(annotationUID) {
    const detail = makeEventDetail();
    if (annotationUID) {
        if (selectedAnnotationUIDs.delete(annotationUID)) {
            detail.removed.push(annotationUID);
        }
    }
    else {
        clearSelectionSet(selectedAnnotationUIDs, detail);
    }
    publish(detail, selectedAnnotationUIDs);
}
function getAnnotationsSelected() {
    return Array.from(selectedAnnotationUIDs);
}
function getAnnotationsSelectedByToolName(toolName) {
    return getAnnotationsSelected().filter((annotationUID) => {
        const annotation = getAnnotation(annotationUID);
        return annotation.metadata.toolName === toolName;
    });
}
function isAnnotationSelected(annotationUID) {
    return selectedAnnotationUIDs.has(annotationUID);
}
function getAnnotationsSelectedCount() {
    return selectedAnnotationUIDs.size;
}
function makeEventDetail() {
    return Object.freeze({
        added: [],
        removed: [],
        selection: [],
    });
}
function clearSelectionSet(selectionSet, detail) {
    selectionSet.forEach((value) => {
        if (selectionSet.delete(value)) {
            detail.removed.push(value);
        }
    });
}
function publish(detail, selectionSet) {
    if (detail.added.length > 0 || detail.removed.length > 0) {
        selectionSet.forEach((item) => void detail.selection.push(item));
        triggerEvent(eventTarget, Events.ANNOTATION_SELECTION_CHANGE, detail);
    }
}
export { setAnnotationSelected, getAnnotationsSelected, getAnnotationsSelectedByToolName, getAnnotationsSelectedCount, deselectAnnotation, isAnnotationSelected, };
//# sourceMappingURL=annotationSelection.js.map