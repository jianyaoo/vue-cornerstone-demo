"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndDefineIsVisibleProperty = exports.isAnnotationVisible = exports.showAllAnnotations = exports.setAnnotationVisibility = void 0;
const core_1 = require("@cornerstonejs/core");
const annotationState_1 = require("./annotationState");
const enums_1 = require("../../enums");
const annotationSelection_1 = require("./annotationSelection");
const globalHiddenAnnotationUIDsSet = new Set();
function setAnnotationVisibility(annotationUID, visible = true) {
    const detail = makeEventDetail();
    if (annotationUID) {
        if (visible) {
            show(annotationUID, globalHiddenAnnotationUIDsSet, detail);
        }
        else {
            hide(annotationUID, globalHiddenAnnotationUIDsSet, detail);
        }
    }
    publish(detail);
}
exports.setAnnotationVisibility = setAnnotationVisibility;
function showAllAnnotations() {
    const detail = makeEventDetail();
    globalHiddenAnnotationUIDsSet.forEach((annotationUID) => {
        show(annotationUID, globalHiddenAnnotationUIDsSet, detail);
    });
    publish(detail);
}
exports.showAllAnnotations = showAllAnnotations;
function isAnnotationVisible(annotationUID) {
    const annotation = (0, annotationState_1.getAnnotation)(annotationUID);
    if (annotation) {
        return !globalHiddenAnnotationUIDsSet.has(annotationUID);
    }
}
exports.isAnnotationVisible = isAnnotationVisible;
function checkAndDefineIsVisibleProperty(annotation) {
    var _a;
    if (annotation) {
        const isVisible = (_a = annotation.isVisible) !== null && _a !== void 0 ? _a : true;
        if (shouldDefineIsVisibleProperty(annotation)) {
            Object.defineProperty(annotation, 'isVisible', {
                configurable: false,
                enumerable: true,
                set: setIsVisible,
                get: getIsVisible,
            });
        }
        setAnnotationVisibility(annotation.annotationUID, isVisible);
    }
}
exports.checkAndDefineIsVisibleProperty = checkAndDefineIsVisibleProperty;
function makeEventDetail() {
    return Object.freeze({
        lastVisible: [],
        lastHidden: [],
        hidden: [],
    });
}
function show(annotationUID, annotationUIDsSet, detail) {
    if (annotationUIDsSet.delete(annotationUID)) {
        detail.lastVisible.push(annotationUID);
    }
}
function hide(annotationUID, annotationUIDsSet, detail) {
    if (!annotationUIDsSet.has(annotationUID)) {
        annotationUIDsSet.add(annotationUID);
        if ((0, annotationSelection_1.isAnnotationSelected)(annotationUID)) {
            (0, annotationSelection_1.deselectAnnotation)(annotationUID);
        }
        detail.lastHidden.push(annotationUID);
    }
}
function publish(detail) {
    if (detail.lastHidden.length > 0 || detail.lastVisible.length > 0) {
        globalHiddenAnnotationUIDsSet.forEach((item) => void detail.hidden.push(item));
        (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.ANNOTATION_VISIBILITY_CHANGE, detail);
    }
}
function shouldDefineIsVisibleProperty(annotation) {
    const descriptor = Object.getOwnPropertyDescriptor(annotation, 'isVisible');
    if (descriptor) {
        return (descriptor.configurable &&
            (descriptor.set !== setIsVisible || descriptor.get !== getIsVisible));
    }
    return Object.isExtensible(annotation);
}
function setIsVisible(hidden) {
    setAnnotationVisibility(this.annotationUID, hidden);
}
function getIsVisible() {
    return isAnnotationVisible(this.annotationUID);
}
//# sourceMappingURL=annotationVisibility.js.map