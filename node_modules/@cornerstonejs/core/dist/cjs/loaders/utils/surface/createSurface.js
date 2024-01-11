"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSurface = void 0;
const enums_1 = require("../../../enums");
const validateSurface_1 = require("./validateSurface");
const Surface_1 = require("../../../cache/classes/Surface");
function createSurface(geometryId, SurfaceData) {
    (0, validateSurface_1.validateSurface)(SurfaceData);
    const surface = new Surface_1.Surface({
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
        type: enums_1.GeometryType.SURFACE,
        data: surface,
        sizeInBytes: surface.getSizeInBytes(),
    };
    return geometry;
}
exports.createSurface = createSurface;
//# sourceMappingURL=createSurface.js.map