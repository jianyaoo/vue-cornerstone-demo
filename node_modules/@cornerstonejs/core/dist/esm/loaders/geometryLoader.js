import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import cache from '../cache';
import { GeometryType } from '../enums';
import { createContourSet } from './utils/contourSet/createContourSet';
import { createSurface } from './utils/surface/createSurface';
async function createAndCacheGeometry(geometryId, options) {
    let geometry = cache.getGeometry(geometryId);
    if (geometry) {
        return geometry;
    }
    if (options.type === GeometryType.CONTOUR) {
        geometry = createContourSet(geometryId, options.geometryData);
    }
    else if (options.type === GeometryType.SURFACE) {
        geometry = createSurface(geometryId, options.geometryData);
    }
    else {
        throw new Error('Unknown geometry type, Only CONTOUR is supported');
    }
    const geometryLoadObject = {
        promise: Promise.resolve(geometry),
    };
    await cache.putGeometryLoadObject(geometryId, geometryLoadObject);
    return geometry;
}
export { createAndCacheGeometry };
//# sourceMappingURL=geometryLoader.js.map