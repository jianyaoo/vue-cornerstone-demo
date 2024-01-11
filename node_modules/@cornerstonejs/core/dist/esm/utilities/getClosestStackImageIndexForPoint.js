import { vec3 } from 'gl-matrix';
import { planar } from '.';
import { metaData } from '..';
export default function getClosestStackImageIndexForPoint(point, viewport) {
    const minimalDistance = calculateMinimalDistanceForStackViewport(point, viewport);
    return minimalDistance ? minimalDistance.index : null;
}
export function calculateMinimalDistanceForStackViewport(point, viewport) {
    const imageIds = viewport.getImageIds();
    const currentImageIdIndex = viewport.getCurrentImageIdIndex();
    if (imageIds.length === 0) {
        return null;
    }
    const getDistance = (imageId) => {
        const planeMetadata = getPlaneMetadata(imageId);
        if (!planeMetadata) {
            return null;
        }
        const plane = planar.planeEquation(planeMetadata.planeNormal, planeMetadata.imagePositionPatient);
        const distance = planar.planeDistanceToPoint(plane, point);
        return distance;
    };
    const closestStack = {
        distance: getDistance(imageIds[currentImageIdIndex]) ?? Infinity,
        index: currentImageIdIndex,
    };
    const higherImageIds = imageIds.slice(currentImageIdIndex + 1);
    for (let i = 0; i < higherImageIds.length; i++) {
        const id = higherImageIds[i];
        const distance = getDistance(id);
        if (distance === null) {
            continue;
        }
        if (distance <= closestStack.distance) {
            closestStack.distance = distance;
            closestStack.index = i + currentImageIdIndex + 1;
        }
        else {
            break;
        }
    }
    const lowerImageIds = imageIds.slice(0, currentImageIdIndex);
    for (let i = lowerImageIds.length - 1; i >= 0; i--) {
        const id = lowerImageIds[i];
        const distance = getDistance(id);
        if (distance === null || distance === closestStack.distance) {
            continue;
        }
        if (distance < closestStack.distance) {
            closestStack.distance = distance;
            closestStack.index = i;
        }
        else {
            break;
        }
    }
    return closestStack.distance === Infinity ? null : closestStack;
}
function getPlaneMetadata(imageId) {
    const targetImagePlane = metaData.get('imagePlaneModule', imageId);
    if (!targetImagePlane ||
        !(targetImagePlane.rowCosines instanceof Array &&
            targetImagePlane.rowCosines.length === 3) ||
        !(targetImagePlane.columnCosines instanceof Array &&
            targetImagePlane.columnCosines.length === 3) ||
        !(targetImagePlane.imagePositionPatient instanceof Array &&
            targetImagePlane.imagePositionPatient.length === 3)) {
        return null;
    }
    const { rowCosines, columnCosines, imagePositionPatient, } = targetImagePlane;
    const rowVec = vec3.set(vec3.create(), ...rowCosines);
    const colVec = vec3.set(vec3.create(), ...columnCosines);
    const planeNormal = vec3.cross(vec3.create(), rowVec, colVec);
    return { rowCosines, columnCosines, imagePositionPatient, planeNormal };
}
//# sourceMappingURL=getClosestStackImageIndexForPoint.js.map