import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import { GeometryType } from '../enums';
import { IGeometry, PublicContourSetData, PublicSurfaceData } from '../types';
declare type GeometryOptions = {
    type: GeometryType;
    geometryData: PublicContourSetData | PublicSurfaceData;
};
declare function createAndCacheGeometry(geometryId: string, options: GeometryOptions): Promise<IGeometry>;
export { createAndCacheGeometry };
//# sourceMappingURL=geometryLoader.d.ts.map