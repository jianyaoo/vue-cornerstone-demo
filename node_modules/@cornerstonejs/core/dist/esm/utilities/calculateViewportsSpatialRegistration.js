import { vec3, mat4 } from 'gl-matrix';
import spatialRegistrationMetadataProvider from './spatialRegistrationMetadataProvider';
import { metaData } from '..';
const ALLOWED_DELTA = 0.05;
function calculateViewportsSpatialRegistration(viewport1, viewport2) {
    const imageId1 = viewport1.getCurrentImageId();
    const imageId2 = viewport2.getCurrentImageId();
    const imagePlaneModule1 = metaData.get('imagePlaneModule', imageId1);
    const imagePlaneModule2 = metaData.get('imagePlaneModule', imageId2);
    if (!imagePlaneModule1 || !imagePlaneModule2) {
        console.log('Viewport spatial registration requires image plane module');
        return;
    }
    const { imageOrientationPatient: iop2 } = imagePlaneModule2;
    const isSameImagePlane = imagePlaneModule1.imageOrientationPatient.every((v, i) => Math.abs(v - iop2[i]) < ALLOWED_DELTA);
    if (!isSameImagePlane) {
        console.log('Viewport spatial registration only supported for same orientation (hence translation only) for now', imagePlaneModule1?.imageOrientationPatient, imagePlaneModule2?.imageOrientationPatient);
        return;
    }
    const imagePositionPatient1 = imagePlaneModule1.imagePositionPatient;
    const imagePositionPatient2 = imagePlaneModule2.imagePositionPatient;
    const translation = vec3.subtract(vec3.create(), imagePositionPatient1, imagePositionPatient2);
    const mat = mat4.fromTranslation(mat4.create(), translation);
    spatialRegistrationMetadataProvider.add([viewport1.id, viewport2.id], mat);
}
export default calculateViewportsSpatialRegistration;
//# sourceMappingURL=calculateViewportsSpatialRegistration.js.map