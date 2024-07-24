import { vec3 } from 'gl-matrix';
import { metaData, getConfiguration } from '../';
export default function sortImageIdsAndGetSpacing(imageIds, scanAxisNormal) {
    const { imagePositionPatient: referenceImagePositionPatient, imageOrientationPatient, } = metaData.get('imagePlaneModule', imageIds[0]);
    if (!scanAxisNormal) {
        const rowCosineVec = vec3.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
        const colCosineVec = vec3.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
        scanAxisNormal = vec3.create();
        vec3.cross(scanAxisNormal, rowCosineVec, colCosineVec);
    }
    const refIppVec = vec3.create();
    const usingWadoUri = imageIds[0].split(':')[0] === 'wadouri';
    vec3.set(refIppVec, referenceImagePositionPatient[0], referenceImagePositionPatient[1], referenceImagePositionPatient[2]);
    let sortedImageIds;
    let zSpacing;
    function getDistance(imageId) {
        const { imagePositionPatient } = metaData.get('imagePlaneModule', imageId);
        const positionVector = vec3.create();
        vec3.sub(positionVector, referenceImagePositionPatient, imagePositionPatient);
        return vec3.dot(positionVector, scanAxisNormal);
    }
    if (!usingWadoUri) {
        const distanceImagePairs = imageIds.map((imageId) => {
            const distance = getDistance(imageId);
            return {
                distance,
                imageId,
            };
        });
        distanceImagePairs.sort((a, b) => b.distance - a.distance);
        sortedImageIds = distanceImagePairs.map((a) => a.imageId);
        const numImages = distanceImagePairs.length;
        zSpacing =
            Math.abs(distanceImagePairs[numImages - 1].distance -
                distanceImagePairs[0].distance) /
                (numImages - 1);
    }
    else {
        const prefetchedImageIds = [
            imageIds[0],
            imageIds[Math.floor(imageIds.length / 2)],
        ];
        sortedImageIds = imageIds;
        const firstImageDistance = getDistance(prefetchedImageIds[0]);
        const middleImageDistance = getDistance(prefetchedImageIds[1]);
        if (firstImageDistance - middleImageDistance < 0) {
            sortedImageIds.reverse();
        }
        const metadataForMiddleImage = metaData.get('imagePlaneModule', prefetchedImageIds[1]);
        if (!metadataForMiddleImage) {
            throw new Error('Incomplete metadata required for volume construction.');
        }
        const positionVector = vec3.create();
        vec3.sub(positionVector, referenceImagePositionPatient, metadataForMiddleImage.imagePositionPatient);
        const distanceBetweenFirstAndMiddleImages = vec3.dot(positionVector, scanAxisNormal);
        zSpacing =
            Math.abs(distanceBetweenFirstAndMiddleImages) /
                Math.floor(imageIds.length / 2);
    }
    const { imagePositionPatient: origin, sliceThickness, spacingBetweenSlices, } = metaData.get('imagePlaneModule', sortedImageIds[0]);
    const { strictZSpacingForVolumeViewport } = getConfiguration().rendering;
    if (zSpacing === 0 && !strictZSpacingForVolumeViewport) {
        if (sliceThickness && spacingBetweenSlices) {
            console.log('Could not calculate zSpacing. Using spacingBetweenSlices');
            zSpacing = spacingBetweenSlices;
        }
        else if (sliceThickness) {
            console.log('Could not calculate zSpacing and no spacingBetweenSlices. Using sliceThickness');
            zSpacing = sliceThickness;
        }
        else {
            console.log('Could not calculate zSpacing. The VolumeViewport visualization is compromised. Setting zSpacing to 1 to render');
            zSpacing = 1;
        }
    }
    const result = {
        zSpacing,
        origin,
        sortedImageIds,
    };
    return result;
}
//# sourceMappingURL=sortImageIdsAndGetSpacing.js.map