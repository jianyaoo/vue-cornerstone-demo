import { vec3 } from 'gl-matrix';
import { metaData } from '..';
function worldToImageCoords(imageId, worldCoords) {
    const imagePlaneModule = metaData.get('imagePlaneModule', imageId);
    if (!imagePlaneModule) {
        throw new Error(`No imagePlaneModule found for imageId: ${imageId}`);
    }
    const { columnCosines, rowCosines, imagePositionPatient: origin, } = imagePlaneModule;
    let { columnPixelSpacing, rowPixelSpacing } = imagePlaneModule;
    columnPixelSpacing ||= 1;
    rowPixelSpacing ||= 1;
    const newOrigin = vec3.create();
    vec3.scaleAndAdd(newOrigin, origin, columnCosines, -columnPixelSpacing / 2);
    vec3.scaleAndAdd(newOrigin, newOrigin, rowCosines, -rowPixelSpacing / 2);
    const sub = vec3.create();
    vec3.sub(sub, worldCoords, newOrigin);
    const rowDistance = vec3.dot(sub, rowCosines);
    const columnDistance = vec3.dot(sub, columnCosines);
    const imageCoords = [
        rowDistance / rowPixelSpacing,
        columnDistance / columnPixelSpacing,
    ];
    return imageCoords;
}
export default worldToImageCoords;
//# sourceMappingURL=worldToImageCoords.js.map