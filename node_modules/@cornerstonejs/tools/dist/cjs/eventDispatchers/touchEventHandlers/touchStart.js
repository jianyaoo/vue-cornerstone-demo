"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../../store");
const enums_1 = require("../../enums");
const annotationSelection_1 = require("../../stateManagement/annotation/annotationSelection");
const annotationLocking_1 = require("../../stateManagement/annotation/annotationLocking");
const annotationVisibility_1 = require("../../stateManagement/annotation/annotationVisibility");
const filterToolsWithMoveableHandles_1 = __importDefault(require("../../store/filterToolsWithMoveableHandles"));
const filterToolsWithAnnotationsForElement_1 = __importDefault(require("../../store/filterToolsWithAnnotationsForElement"));
const filterMoveableAnnotationTools_1 = __importDefault(require("../../store/filterMoveableAnnotationTools"));
const getActiveToolForTouchEvent_1 = __importDefault(require("../shared/getActiveToolForTouchEvent"));
const getToolsWithModesForTouchEvent_1 = __importDefault(require("../shared/getToolsWithModesForTouchEvent"));
const { Active, Passive } = enums_1.ToolModes;
function touchStart(evt) {
    if (store_1.state.isInteractingWithTool) {
        return;
    }
    const activeTool = (0, getActiveToolForTouchEvent_1.default)(evt);
    if (activeTool && typeof activeTool.preTouchStartCallback === 'function') {
        const consumedEvent = activeTool.preTouchStartCallback(evt);
        if (consumedEvent) {
            return;
        }
    }
    const isPrimaryClick = Object.keys(evt.detail.event.touches).length === 1;
    const activeToolsWithEventBinding = (0, getToolsWithModesForTouchEvent_1.default)(evt, [Active], Object.keys(evt.detail.event.touches).length);
    const passiveToolsIfEventWasPrimaryTouchButton = isPrimaryClick
        ? (0, getToolsWithModesForTouchEvent_1.default)(evt, [Passive])
        : undefined;
    const applicableTools = [
        ...(activeToolsWithEventBinding || []),
        ...(passiveToolsIfEventWasPrimaryTouchButton || []),
        activeTool,
    ];
    const eventDetail = evt.detail;
    const { element } = eventDetail;
    const annotationToolsWithAnnotations = (0, filterToolsWithAnnotationsForElement_1.default)(element, applicableTools);
    const canvasCoords = eventDetail.currentPoints.canvas;
    const annotationToolsWithMoveableHandles = (0, filterToolsWithMoveableHandles_1.default)(element, annotationToolsWithAnnotations, canvasCoords, 'touch');
    const isMultiSelect = false;
    if (annotationToolsWithMoveableHandles.length > 0) {
        const { tool, annotation, handle } = getAnnotationForSelection(annotationToolsWithMoveableHandles);
        toggleAnnotationSelection(annotation.annotationUID, isMultiSelect);
        tool.handleSelectedCallback(evt, annotation, handle, 'Touch');
        return;
    }
    const moveableAnnotationTools = (0, filterMoveableAnnotationTools_1.default)(element, annotationToolsWithAnnotations, canvasCoords, 'touch');
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
exports.default = touchStart;
function getAnnotationForSelection(toolsWithMovableHandles) {
    return ((toolsWithMovableHandles.length > 1 &&
        toolsWithMovableHandles.find((item) => !(0, annotationLocking_1.isAnnotationLocked)(item.annotation) &&
            (0, annotationVisibility_1.isAnnotationVisible)(item.annotation.annotationUID))) ||
        toolsWithMovableHandles[0]);
}
function toggleAnnotationSelection(annotationUID, isMultiSelect = false) {
    if (isMultiSelect) {
        if ((0, annotationSelection_1.isAnnotationSelected)(annotationUID)) {
            (0, annotationSelection_1.setAnnotationSelected)(annotationUID, false);
        }
        else {
            const preserveSelected = true;
            (0, annotationSelection_1.setAnnotationSelected)(annotationUID, true, preserveSelected);
        }
    }
    else {
        const preserveSelected = false;
        (0, annotationSelection_1.setAnnotationSelected)(annotationUID, true, preserveSelected);
    }
}
//# sourceMappingURL=touchStart.js.map