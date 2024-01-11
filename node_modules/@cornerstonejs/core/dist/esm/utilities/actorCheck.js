export function isImageActor(actorEntry) {
    return (actorIsA(actorEntry, 'vtkVolume') || actorIsA(actorEntry, 'vtkImageSlice'));
}
export function actorIsA(actorEntry, actorType) {
    const actor = actorEntry.actor;
    return !!actor.isA(actorType);
}
//# sourceMappingURL=actorCheck.js.map