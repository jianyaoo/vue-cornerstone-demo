"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actorIsA = exports.isImageActor = void 0;
function isImageActor(actorEntry) {
    return (actorIsA(actorEntry, 'vtkVolume') || actorIsA(actorEntry, 'vtkImageSlice'));
}
exports.isImageActor = isImageActor;
function actorIsA(actorEntry, actorType) {
    const actorToCheck = 'isA' in actorEntry ? actorEntry : actorEntry.actor;
    return !!actorToCheck.isA(actorType);
}
exports.actorIsA = actorIsA;
//# sourceMappingURL=actorCheck.js.map