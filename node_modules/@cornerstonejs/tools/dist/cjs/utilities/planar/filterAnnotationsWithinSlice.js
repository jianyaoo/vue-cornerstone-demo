"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const core_1 = require("@cornerstonejs/core");
const { EPSILON } = core_1.CONSTANTS;
const PARALLEL_THRESHOLD = 1 - EPSILON;
function filterAnnotationsWithinSlice(annotations, camera, spacingInNormalDirection) {
    const { viewPlaneNormal } = camera;
    const annotationsWithParallelNormals = annotations.filter((td) => {
        let annotationViewPlaneNormal = td.metadata.viewPlaneNormal;
        if (!annotationViewPlaneNormal) {
            const { referencedImageId } = td.metadata;
            const { imageOrientationPatient } = core_1.metaData.get('imagePlaneModule', referencedImageId);
            const rowCosineVec = gl_matrix_1.vec3.fromValues(imageOrientationPatient[0], imageOrientationPatient[1], imageOrientationPatient[2]);
            const colCosineVec = gl_matrix_1.vec3.fromValues(imageOrientationPatient[3], imageOrientationPatient[4], imageOrientationPatient[5]);
            annotationViewPlaneNormal = gl_matrix_1.vec3.create();
            gl_matrix_1.vec3.cross(annotationViewPlaneNormal, rowCosineVec, colCosineVec);
            td.metadata.viewPlaneNormal = annotationViewPlaneNormal;
        }
        const isParallel = Math.abs(gl_matrix_1.vec3.dot(viewPlaneNormal, annotationViewPlaneNormal)) >
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
        const dir = gl_matrix_1.vec3.create();
        gl_matrix_1.vec3.sub(dir, focalPoint, point);
        const dot = gl_matrix_1.vec3.dot(dir, viewPlaneNormal);
        if (Math.abs(dot) < halfSpacingInNormalDirection) {
            annotationsWithinSlice.push(annotation);
        }
    }
    return annotationsWithinSlice;
}
exports.default = filterAnnotationsWithinSlice;
//# sourceMappingURL=filterAnnotationsWithinSlice.js.map