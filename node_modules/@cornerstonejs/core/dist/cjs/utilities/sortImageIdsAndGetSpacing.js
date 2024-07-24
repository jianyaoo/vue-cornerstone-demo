"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const __1 = require("../");
function sortImageIdsAndGetSpacing(imageIds, scanAxisNormal) {
    const { imagePositionPatient: referenceImagePositionPatient, imageOrientationPatient, } = __1.metaData.get('imagePlaneModule', imageIds[0]);
    if (!scanAxisNormal) {
        const rowCosineVec = gl_matrix_1.vec3.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
        const colCosineVec = gl_matrix_1.vec3.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
        scanAxisNormal = gl_matrix_1.vec3.create();
        gl_matrix_1.vec3.cross(scanAxisNormal, rowCosineVec, colCosineVec);
    }
    const refIppVec = gl_matrix_1.vec3.create();
    const usingWadoUri = imageIds[0].split(':')[0] === 'wadouri';
    gl_matrix_1.vec3.set(refIppVec, referenceImagePositionPatient[0], referenceImagePositionPatient[1], referenceImagePositionPatient[2]);
    let sortedImageIds;
    let zSpacing;
    function getDistance(imageId) {
        const { imagePositionPatient } = __1.metaData.get('imagePlaneModule', imageId);
        const positionVector = gl_matrix_1.vec3.create();
        gl_matrix_1.vec3.sub(positionVector, referenceImagePositionPatient, imagePositionPatient);
        return gl_matrix_1.vec3.dot(positionVector, scanAxisNormal);
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
        const metadataForMiddleImage = __1.metaData.get('imagePlaneModule', prefetchedImageIds[1]);
        if (!metadataForMiddleImage) {
            throw new Error('Incomplete metadata required for volume construction.');
        }
        const positionVector = gl_matrix_1.vec3.create();
        gl_matrix_1.vec3.sub(positionVector, referenceImagePositionPatient, metadataForMiddleImage.imagePositionPatient);
        const distanceBetweenFirstAndMiddleImages = gl_matrix_1.vec3.dot(positionVector, scanAxisNormal);
        zSpacing =
            Math.abs(distanceBetweenFirstAndMiddleImages) /
                Math.floor(imageIds.length / 2);
    }
    const { imagePositionPatient: origin, sliceThickness, spacingBetweenSlices, } = __1.metaData.get('imagePlaneModule', sortedImageIds[0]);
    const { strictZSpacingForVolumeViewport } = (0, __1.getConfiguration)().rendering;
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
exports.default = sortImageIdsAndGetSpacing;
//# sourceMappingURL=sortImageIdsAndGetSpacing.js.map