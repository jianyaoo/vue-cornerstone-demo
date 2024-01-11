import { vec3 } from 'gl-matrix';
export default function snapFocalPointToSlice(focalPoint, position, sliceRange, viewPlaneNormal, spacingInNormalDirection, deltaFrames) {
    const { min, max, current } = sliceRange;
    const posDiffFromFocalPoint = vec3.create();
    vec3.sub(posDiffFromFocalPoint, position, focalPoint);
    const steps = Math.round((max - min) / spacingInNormalDirection);
    const fraction = (current - min) / (max - min);
    const floatingStepNumber = fraction * steps;
    let frameIndex = Math.round(floatingStepNumber);
    let newFocalPoint = [
        focalPoint[0] -
            viewPlaneNormal[0] * floatingStepNumber * spacingInNormalDirection,
        focalPoint[1] -
            viewPlaneNormal[1] * floatingStepNumber * spacingInNormalDirection,
        focalPoint[2] -
            viewPlaneNormal[2] * floatingStepNumber * spacingInNormalDirection,
    ];
    frameIndex += deltaFrames;
    if (frameIndex > steps) {
        frameIndex = steps;
    }
    else if (frameIndex < 0) {
        frameIndex = 0;
    }
    const newSlicePosFromMin = frameIndex * spacingInNormalDirection;
    newFocalPoint = [
        newFocalPoint[0] + viewPlaneNormal[0] * newSlicePosFromMin,
        newFocalPoint[1] + viewPlaneNormal[1] * newSlicePosFromMin,
        newFocalPoint[2] + viewPlaneNormal[2] * newSlicePosFromMin,
    ];
    const newPosition = [
        newFocalPoint[0] + posDiffFromFocalPoint[0],
        newFocalPoint[1] + posDiffFromFocalPoint[1],
        newFocalPoint[2] + posDiffFromFocalPoint[2],
    ];
    return { newFocalPoint, newPosition };
}
//# sourceMappingURL=snapFocalPointToSlice.js.map