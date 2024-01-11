import { StackViewport } from '@cornerstonejs/core';
import { vec3 } from 'gl-matrix';
const EPSILON = 1e-3;
const getSubPixelSpacingAndXYDirections = (viewport, subPixelResolution) => {
    let spacing;
    let xDir;
    let yDir;
    if (viewport instanceof StackViewport) {
        const imageData = viewport.getImageData();
        xDir = imageData.direction.slice(0, 3);
        yDir = imageData.direction.slice(3, 6);
        spacing = imageData.spacing;
    }
    else {
        const imageData = viewport.getImageData();
        const { direction, spacing: volumeSpacing } = imageData;
        const { viewPlaneNormal, viewUp } = viewport.getCamera();
        const iVector = direction.slice(0, 3);
        const jVector = direction.slice(3, 6);
        const kVector = direction.slice(6, 9);
        const viewRight = vec3.create();
        vec3.cross(viewRight, viewUp, viewPlaneNormal);
        const absViewRightDotI = Math.abs(vec3.dot(viewRight, iVector));
        const absViewRightDotJ = Math.abs(vec3.dot(viewRight, jVector));
        const absViewRightDotK = Math.abs(vec3.dot(viewRight, kVector));
        let xSpacing;
        if (Math.abs(1 - absViewRightDotI) < EPSILON) {
            xSpacing = volumeSpacing[0];
            xDir = iVector;
        }
        else if (Math.abs(1 - absViewRightDotJ) < EPSILON) {
            xSpacing = volumeSpacing[1];
            xDir = jVector;
        }
        else if (Math.abs(1 - absViewRightDotK) < EPSILON) {
            xSpacing = volumeSpacing[2];
            xDir = kVector;
        }
        else {
            throw new Error('No support yet for oblique plane planar contours');
        }
        const absViewUpDotI = Math.abs(vec3.dot(viewUp, iVector));
        const absViewUpDotJ = Math.abs(vec3.dot(viewUp, jVector));
        const absViewUpDotK = Math.abs(vec3.dot(viewUp, kVector));
        let ySpacing;
        if (Math.abs(1 - absViewUpDotI) < EPSILON) {
            ySpacing = volumeSpacing[0];
            yDir = iVector;
        }
        else if (Math.abs(1 - absViewUpDotJ) < EPSILON) {
            ySpacing = volumeSpacing[1];
            yDir = jVector;
        }
        else if (Math.abs(1 - absViewUpDotK) < EPSILON) {
            ySpacing = volumeSpacing[2];
            yDir = kVector;
        }
        else {
            throw new Error('No support yet for oblique plane planar contours');
        }
        spacing = [xSpacing, ySpacing];
    }
    const subPixelSpacing = [
        spacing[0] / subPixelResolution,
        spacing[1] / subPixelResolution,
    ];
    return { spacing: subPixelSpacing, xDir, yDir };
};
export default getSubPixelSpacingAndXYDirections;
//# sourceMappingURL=getSubPixelSpacingAndXYDirections.js.map