import { GeometryType } from '../../../enums';
import { validateSurface } from './validateSurface';
import { Surface } from '../../../cache/classes/Surface';
export function createSurface(geometryId, SurfaceData) {
    validateSurface(SurfaceData);
    const surface = new Surface({
        id: SurfaceData.id,
        color: SurfaceData.color,
        frameOfReferenceUID: SurfaceData.frameOfReferenceUID,
        data: {
            points: SurfaceData.data.points,
            polys: SurfaceData.data.polys,
        },
    });
    const geometry = {
        id: geometryId,
        type: GeometryType.SURFACE,
        data: surface,
        sizeInBytes: surface.getSizeInBytes(),
    };
    return geometry;
}
//# sourceMappingURL=createSurface.js.map