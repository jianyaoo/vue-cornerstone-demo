import { eventTarget, triggerEvent } from '@cornerstonejs/core';
import { getAnnotation } from './annotationState';
import { Events } from '../../enums';
import { isAnnotationSelected, deselectAnnotation, } from './annotationSelection';
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
function showAllAnnotations() {
    const detail = makeEventDetail();
    globalHiddenAnnotationUIDsSet.forEach((annotationUID) => {
        show(annotationUID, globalHiddenAnnotationUIDsSet, detail);
    });
    publish(detail);
}
function isAnnotationVisible(annotationUID) {
    const annotation = getAnnotation(annotationUID);
    if (annotation) {
        return !globalHiddenAnnotationUIDsSet.has(annotationUID);
    }
}
function checkAndDefineIsVisibleProperty(annotation) {
    if (annotation) {
        const isVisible = annotation.isVisible ?? true;
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
        if (isAnnotationSelected(annotationUID)) {
            deselectAnnotation(annotationUID);
        }
        detail.lastHidden.push(annotationUID);
    }
}
function publish(detail) {
    if (detail.lastHidden.length > 0 || detail.lastVisible.length > 0) {
        globalHiddenAnnotationUIDsSet.forEach((item) => void detail.hidden.push(item));
        triggerEvent(eventTarget, Events.ANNOTATION_VISIBILITY_CHANGE, detail);
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
export { setAnnotationVisibility, showAllAnnotations, isAnnotationVisible, checkAndDefineIsVisibleProperty, };
//# sourceMappingURL=annotationVisibility.js.map