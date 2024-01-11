import { eventTarget, triggerEvent } from '@cornerstonejs/core';
import { Events } from '../../enums';
const globalLockedAnnotationsSet = new Set();
function setAnnotationLocked(annotation, locked = true) {
    const detail = makeEventDetail();
    if (annotation) {
        if (locked) {
            lock(annotation, globalLockedAnnotationsSet, detail);
        }
        else {
            unlock(annotation, globalLockedAnnotationsSet, detail);
        }
    }
    publish(detail, globalLockedAnnotationsSet);
}
function unlockAllAnnotations() {
    const detail = makeEventDetail();
    clearLockedAnnotationsSet(globalLockedAnnotationsSet, detail);
    publish(detail, globalLockedAnnotationsSet);
}
function getAnnotationsLocked() {
    return Array.from(globalLockedAnnotationsSet);
}
function isAnnotationLocked(annotation) {
    return globalLockedAnnotationsSet.has(annotation);
}
function getAnnotationsLockedCount() {
    return globalLockedAnnotationsSet.size;
}
function checkAndDefineIsLockedProperty(annotation) {
    if (annotation) {
        const isLocked = !!annotation.isLocked;
        if (shouldDefineIsLockedProperty(annotation)) {
            Object.defineProperty(annotation, 'isLocked', {
                configurable: false,
                enumerable: true,
                set: setIsLocked,
                get: getIsLocked,
            });
        }
        setAnnotationLocked(annotation, isLocked);
    }
}
function makeEventDetail() {
    return Object.freeze({
        added: [],
        removed: [],
        locked: [],
    });
}
function lock(annotation, lockedAnnotationsSet, detail) {
    if (!lockedAnnotationsSet.has(annotation)) {
        lockedAnnotationsSet.add(annotation);
        detail.added.push(annotation);
    }
}
function unlock(annotation, lockedAnnotationsSet, detail) {
    if (lockedAnnotationsSet.delete(annotation)) {
        detail.removed.push(annotation);
    }
}
function clearLockedAnnotationsSet(lockedAnnotationsSet, detail) {
    lockedAnnotationsSet.forEach((annotation) => {
        unlock(annotation, lockedAnnotationsSet, detail);
    });
}
function publish(detail, lockedAnnotationsSet) {
    if (detail.added.length > 0 || detail.removed.length > 0) {
        lockedAnnotationsSet.forEach((item) => void detail.locked.push(item));
        triggerEvent(eventTarget, Events.ANNOTATION_LOCK_CHANGE, detail);
    }
}
function shouldDefineIsLockedProperty(annotation) {
    const descriptor = Object.getOwnPropertyDescriptor(annotation, 'isLocked');
    if (descriptor) {
        return (descriptor.configurable &&
            (descriptor.set !== setIsLocked || descriptor.get !== getIsLocked));
    }
    return Object.isExtensible(annotation);
}
function setIsLocked(locked) {
    setAnnotationLocked(this, locked);
}
function getIsLocked() {
    return isAnnotationLocked(this);
}
export { setAnnotationLocked, getAnnotationsLocked, getAnnotationsLockedCount, unlockAllAnnotations, isAnnotationLocked, checkAndDefineIsLockedProperty, };
//# sourceMappingURL=annotationLocking.js.map