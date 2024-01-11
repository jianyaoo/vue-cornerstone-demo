import { vec3 } from 'gl-matrix';
import * as metaData from '../metaData';
import getSpacingInNormalDirection from './getSpacingInNormalDirection';
import { EPSILON } from '../constants';
export default function getClosestImageId(imageVolume, worldPos, viewPlaneNormal) {
    if (!imageVolume) {
        return;
    }
    const { direction, imageIds } = imageVolume;
    if (!imageIds || !imageIds.length) {
        return;
    }
    const kVector = direction.slice(6, 9);
    const dotProducts = vec3.dot(kVector, viewPlaneNormal);
    if (Math.abs(dotProducts) < 1 - EPSILON) {
        return;
    }
    const spacingInNormalDirection = getSpacingInNormalDirection(imageVolume, viewPlaneNormal);
    const halfSpacingInNormalDirection = spacingInNormalDirection / 2;
    let imageIdForTool;
    for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        const { imagePositionPatient } = metaData.get('imagePlaneModule', imageId);
        const dir = vec3.create();
        vec3.sub(dir, worldPos, imagePositionPatient);
        const dot = vec3.dot(dir, viewPlaneNormal);
        if (Math.abs(dot) < halfSpacingInNormalDirection) {
            imageIdForTool = imageId;
        }
    }
    return imageIdForTool;
}
//# sourceMappingURL=getClosestImageId.js.map