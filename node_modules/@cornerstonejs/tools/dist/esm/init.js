import { eventTarget, Enums } from '@cornerstonejs/core';
import { getAnnotationManager } from './stateManagement/annotation/annotationState';
import { getDefaultSegmentationStateManager } from './stateManagement/segmentation/segmentationState';
import { Events as TOOLS_EVENTS } from './enums';
import { addEnabledElement, removeEnabledElement } from './store';
import { resetCornerstoneToolsState } from './store/state';
import { annotationSelectionListener, segmentationDataModifiedEventListener, segmentationRepresentationModifiedEventListener, segmentationRepresentationRemovedEventListener, segmentationModifiedListener, annotationModifiedListener, } from './eventListeners';
import * as ToolGroupManager from './store/ToolGroupManager';
let csToolsInitialized = false;
export function init(defaultConfiguration = {}) {
    if (csToolsInitialized) {
        return;
    }
    _addCornerstoneEventListeners();
    _addCornerstoneToolsEventListeners();
    csToolsInitialized = true;
}
export function destroy() {
    _removeCornerstoneEventListeners();
    _removeCornerstoneToolsEventListeners();
    ToolGroupManager.destroy();
    resetCornerstoneToolsState();
    const annotationManager = getAnnotationManager();
    const segmentationStateManager = getDefaultSegmentationStateManager();
    annotationManager.restoreAnnotations({});
    segmentationStateManager.resetState();
    csToolsInitialized = false;
}
function _addCornerstoneEventListeners() {
    _removeCornerstoneEventListeners();
    const elementEnabledEvent = Enums.Events.ELEMENT_ENABLED;
    const elementDisabledEvent = Enums.Events.ELEMENT_DISABLED;
    eventTarget.addEventListener(elementEnabledEvent, addEnabledElement);
    eventTarget.addEventListener(elementDisabledEvent, removeEnabledElement);
}
function _removeCornerstoneEventListeners() {
    const elementEnabledEvent = Enums.Events.ELEMENT_ENABLED;
    const elementDisabledEvent = Enums.Events.ELEMENT_DISABLED;
    eventTarget.removeEventListener(elementEnabledEvent, addEnabledElement);
    eventTarget.removeEventListener(elementDisabledEvent, removeEnabledElement);
}
function _addCornerstoneToolsEventListeners() {
    _removeCornerstoneToolsEventListeners();
    eventTarget.addEventListener(TOOLS_EVENTS.ANNOTATION_MODIFIED, annotationModifiedListener);
    eventTarget.addEventListener(TOOLS_EVENTS.ANNOTATION_SELECTION_CHANGE, annotationSelectionListener);
    eventTarget.addEventListener(TOOLS_EVENTS.ANNOTATION_SELECTION_CHANGE, annotationSelectionListener);
    eventTarget.addEventListener(TOOLS_EVENTS.SEGMENTATION_MODIFIED, segmentationModifiedListener);
    eventTarget.addEventListener(TOOLS_EVENTS.SEGMENTATION_DATA_MODIFIED, segmentationDataModifiedEventListener);
    eventTarget.addEventListener(TOOLS_EVENTS.SEGMENTATION_REPRESENTATION_MODIFIED, segmentationRepresentationModifiedEventListener);
    eventTarget.addEventListener(TOOLS_EVENTS.SEGMENTATION_REPRESENTATION_REMOVED, segmentationRepresentationRemovedEventListener);
}
function _removeCornerstoneToolsEventListeners() {
    eventTarget.removeEventListener(TOOLS_EVENTS.ANNOTATION_MODIFIED, annotationModifiedListener);
    eventTarget.removeEventListener(TOOLS_EVENTS.ANNOTATION_SELECTION_CHANGE, annotationSelectionListener);
    eventTarget.removeEventListener(TOOLS_EVENTS.ANNOTATION_SELECTION_CHANGE, annotationSelectionListener);
    eventTarget.removeEventListener(TOOLS_EVENTS.SEGMENTATION_MODIFIED, segmentationModifiedListener);
    eventTarget.removeEventListener(TOOLS_EVENTS.SEGMENTATION_DATA_MODIFIED, segmentationDataModifiedEventListener);
    eventTarget.removeEventListener(TOOLS_EVENTS.SEGMENTATION_REPRESENTATION_MODIFIED, segmentationRepresentationModifiedEventListener);
    eventTarget.removeEventListener(TOOLS_EVENTS.SEGMENTATION_REPRESENTATION_REMOVED, segmentationRepresentationRemovedEventListener);
}
export default init;
//# sourceMappingURL=init.js.map