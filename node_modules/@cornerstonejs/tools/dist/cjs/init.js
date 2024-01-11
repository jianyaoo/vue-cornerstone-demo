"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.init = void 0;
const core_1 = require("@cornerstonejs/core");
const annotationState_1 = require("./stateManagement/annotation/annotationState");
const segmentationState_1 = require("./stateManagement/segmentation/segmentationState");
const enums_1 = require("./enums");
const store_1 = require("./store");
const state_1 = require("./store/state");
const eventListeners_1 = require("./eventListeners");
const ToolGroupManager = __importStar(require("./store/ToolGroupManager"));
let csToolsInitialized = false;
function init(defaultConfiguration = {}) {
    if (csToolsInitialized) {
        return;
    }
    _addCornerstoneEventListeners();
    _addCornerstoneToolsEventListeners();
    csToolsInitialized = true;
}
exports.init = init;
function destroy() {
    _removeCornerstoneEventListeners();
    _removeCornerstoneToolsEventListeners();
    ToolGroupManager.destroy();
    (0, state_1.resetCornerstoneToolsState)();
    const annotationManager = (0, annotationState_1.getAnnotationManager)();
    const segmentationStateManager = (0, segmentationState_1.getDefaultSegmentationStateManager)();
    annotationManager.restoreAnnotations({});
    segmentationStateManager.resetState();
    csToolsInitialized = false;
}
exports.destroy = destroy;
function _addCornerstoneEventListeners() {
    _removeCornerstoneEventListeners();
    const elementEnabledEvent = core_1.Enums.Events.ELEMENT_ENABLED;
    const elementDisabledEvent = core_1.Enums.Events.ELEMENT_DISABLED;
    core_1.eventTarget.addEventListener(elementEnabledEvent, store_1.addEnabledElement);
    core_1.eventTarget.addEventListener(elementDisabledEvent, store_1.removeEnabledElement);
}
function _removeCornerstoneEventListeners() {
    const elementEnabledEvent = core_1.Enums.Events.ELEMENT_ENABLED;
    const elementDisabledEvent = core_1.Enums.Events.ELEMENT_DISABLED;
    core_1.eventTarget.removeEventListener(elementEnabledEvent, store_1.addEnabledElement);
    core_1.eventTarget.removeEventListener(elementDisabledEvent, store_1.removeEnabledElement);
}
function _addCornerstoneToolsEventListeners() {
    _removeCornerstoneToolsEventListeners();
    core_1.eventTarget.addEventListener(enums_1.Events.ANNOTATION_MODIFIED, eventListeners_1.annotationModifiedListener);
    core_1.eventTarget.addEventListener(enums_1.Events.ANNOTATION_SELECTION_CHANGE, eventListeners_1.annotationSelectionListener);
    core_1.eventTarget.addEventListener(enums_1.Events.ANNOTATION_SELECTION_CHANGE, eventListeners_1.annotationSelectionListener);
    core_1.eventTarget.addEventListener(enums_1.Events.SEGMENTATION_MODIFIED, eventListeners_1.segmentationModifiedListener);
    core_1.eventTarget.addEventListener(enums_1.Events.SEGMENTATION_DATA_MODIFIED, eventListeners_1.segmentationDataModifiedEventListener);
    core_1.eventTarget.addEventListener(enums_1.Events.SEGMENTATION_REPRESENTATION_MODIFIED, eventListeners_1.segmentationRepresentationModifiedEventListener);
    core_1.eventTarget.addEventListener(enums_1.Events.SEGMENTATION_REPRESENTATION_REMOVED, eventListeners_1.segmentationRepresentationRemovedEventListener);
}
function _removeCornerstoneToolsEventListeners() {
    core_1.eventTarget.removeEventListener(enums_1.Events.ANNOTATION_MODIFIED, eventListeners_1.annotationModifiedListener);
    core_1.eventTarget.removeEventListener(enums_1.Events.ANNOTATION_SELECTION_CHANGE, eventListeners_1.annotationSelectionListener);
    core_1.eventTarget.removeEventListener(enums_1.Events.ANNOTATION_SELECTION_CHANGE, eventListeners_1.annotationSelectionListener);
    core_1.eventTarget.removeEventListener(enums_1.Events.SEGMENTATION_MODIFIED, eventListeners_1.segmentationModifiedListener);
    core_1.eventTarget.removeEventListener(enums_1.Events.SEGMENTATION_DATA_MODIFIED, eventListeners_1.segmentationDataModifiedEventListener);
    core_1.eventTarget.removeEventListener(enums_1.Events.SEGMENTATION_REPRESENTATION_MODIFIED, eventListeners_1.segmentationRepresentationModifiedEventListener);
    core_1.eventTarget.removeEventListener(enums_1.Events.SEGMENTATION_REPRESENTATION_REMOVED, eventListeners_1.segmentationRepresentationRemovedEventListener);
}
exports.default = init;
//# sourceMappingURL=init.js.map