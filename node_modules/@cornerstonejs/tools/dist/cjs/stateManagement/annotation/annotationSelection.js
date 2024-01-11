"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnnotationSelected = exports.deselectAnnotation = exports.getAnnotationsSelectedCount = exports.getAnnotationsSelectedByToolName = exports.getAnnotationsSelected = exports.setAnnotationSelected = void 0;
const core_1 = require("@cornerstonejs/core");
const enums_1 = require("../../enums");
const annotationState_1 = require("./annotationState");
const selectedAnnotationUIDs = new Set();
function setAnnotationSelected(annotationUID, selected = true, preserveSelected = false) {
    if (selected) {
        selectAnnotation(annotationUID, preserveSelected);
    }
    else {
        deselectAnnotation(annotationUID);
    }
}
exports.setAnnotationSelected = setAnnotationSelected;
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
exports.deselectAnnotation = deselectAnnotation;
function getAnnotationsSelected() {
    return Array.from(selectedAnnotationUIDs);
}
exports.getAnnotationsSelected = getAnnotationsSelected;
function getAnnotationsSelectedByToolName(toolName) {
    return getAnnotationsSelected().filter((annotationUID) => {
        const annotation = (0, annotationState_1.getAnnotation)(annotationUID);
        return annotation.metadata.toolName === toolName;
    });
}
exports.getAnnotationsSelectedByToolName = getAnnotationsSelectedByToolName;
function isAnnotationSelected(annotationUID) {
    return selectedAnnotationUIDs.has(annotationUID);
}
exports.isAnnotationSelected = isAnnotationSelected;
function getAnnotationsSelectedCount() {
    return selectedAnnotationUIDs.size;
}
exports.getAnnotationsSelectedCount = getAnnotationsSelectedCount;
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
        (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.ANNOTATION_SELECTION_CHANGE, detail);
    }
}
//# sourceMappingURL=annotationSelection.js.map