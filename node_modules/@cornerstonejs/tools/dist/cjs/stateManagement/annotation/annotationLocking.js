"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndDefineIsLockedProperty = exports.isAnnotationLocked = exports.unlockAllAnnotations = exports.getAnnotationsLockedCount = exports.getAnnotationsLocked = exports.setAnnotationLocked = void 0;
const core_1 = require("@cornerstonejs/core");
const enums_1 = require("../../enums");
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
exports.setAnnotationLocked = setAnnotationLocked;
function unlockAllAnnotations() {
    const detail = makeEventDetail();
    clearLockedAnnotationsSet(globalLockedAnnotationsSet, detail);
    publish(detail, globalLockedAnnotationsSet);
}
exports.unlockAllAnnotations = unlockAllAnnotations;
function getAnnotationsLocked() {
    return Array.from(globalLockedAnnotationsSet);
}
exports.getAnnotationsLocked = getAnnotationsLocked;
function isAnnotationLocked(annotation) {
    return globalLockedAnnotationsSet.has(annotation);
}
exports.isAnnotationLocked = isAnnotationLocked;
function getAnnotationsLockedCount() {
    return globalLockedAnnotationsSet.size;
}
exports.getAnnotationsLockedCount = getAnnotationsLockedCount;
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
exports.checkAndDefineIsLockedProperty = checkAndDefineIsLockedProperty;
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
        (0, core_1.triggerEvent)(core_1.eventTarget, enums_1.Events.ANNOTATION_LOCK_CHANGE, detail);
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
//# sourceMappingURL=annotationLocking.js.map