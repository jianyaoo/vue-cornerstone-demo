import { vec3 } from 'gl-matrix';
import { CONSTANTS, metaData } from '@cornerstonejs/core';
const { EPSILON } = CONSTANTS;
const PARALLEL_THRESHOLD = 1 - EPSILON;
export default function filterAnnotationsWithinSlice(annotations, camera, spacingInNormalDirection) {
    const { viewPlaneNormal } = camera;
    const annotationsWithParallelNormals = annotations.filter((td) => {
        let annotationViewPlaneNormal = td.metadata.viewPlaneNormal;
        if (!annotationViewPlaneNormal) {
            const { referencedImageId } = td.metadata;
            const { imageOrientationPatient } = metaData.get('imagePlaneModule', referencedImageId);
            const rowCosineVec = vec3.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
            const colCosineVec = vec3.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
            annotationViewPlaneNormal = vec3.create();
            vec3.cross(annotationViewPlaneNormal, rowCosineVec, colCosineVec);
            td.metadata.viewPlaneNormal = annotationViewPlaneNormal;
        }
        const isParallel = Math.abs(vec3.dot(viewPlaneNormal, annotationViewPlaneNormal)) >
            PARALLEL_THRESHOLD;
        return annotationViewPlaneNormal && isParallel;
    });
    if (!annotationsWithParallelNormals.length) {
        return [];
    }
    const halfSpacingInNormalDirection = spacingInNormalDirection / 2;
    const { focalPoint } = camera;
    const annotationsWithinSlice = [];
    for (const annotation of annotationsWithParallelNormals) {
        const data = annotation.data;
        const point = data.handles.points[0];
        if (!annotation.isVisible) {
            continue;
        }
        const dir = vec3.create();
        vec3.sub(dir, focalPoint, point);
        const dot = vec3.dot(dir, viewPlaneNormal);
        if (Math.abs(dot) < halfSpacingInNormalDirection) {
            annotationsWithinSlice.push(annotation);
        }
    }
    return annotationsWithinSlice;
}
//# sourceMappingURL=filterAnnotationsWithinSlice.js.map