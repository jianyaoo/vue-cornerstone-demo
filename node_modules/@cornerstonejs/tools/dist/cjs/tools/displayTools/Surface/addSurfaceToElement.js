"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const Mapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Mapper"));
const Actor_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Actor"));
const ClipClosedSurface_1 = __importDefault(require("@kitware/vtk.js/Filters/General/ClipClosedSurface"));
const PolyData_1 = __importDefault(require("@kitware/vtk.js/Common/DataModel/PolyData"));
const CellArray_1 = __importDefault(require("@kitware/vtk.js/Common/Core/CellArray"));
const pointToString_1 = require("../../../utilities/pointToString");
const polyDataCache = new Map();
function addSurfaceToElement(element, surface, actorUID) {
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const points = surface.getPoints();
    const polys = surface.getPolys();
    const color = surface.getColor();
    const polyData = PolyData_1.default.newInstance();
    polyData.getPoints().setData(points, 3);
    const triangles = CellArray_1.default.newInstance({
        values: Float32Array.from(polys),
    });
    polyData.setPolys(triangles);
    const mapper = Mapper_1.default.newInstance({});
    let clippingFilter;
    if (!(viewport instanceof core_1.VolumeViewport3D)) {
        clippingFilter = ClipClosedSurface_1.default.newInstance({
            clippingPlanes: [],
            activePlaneId: 2,
            passPointData: false,
        });
        clippingFilter.setInputData(polyData);
        clippingFilter.setGenerateOutline(true);
        clippingFilter.setGenerateFaces(false);
        clippingFilter.update();
        const filteredData = clippingFilter.getOutputData();
        mapper.setInputData(filteredData);
    }
    else {
        mapper.setInputData(polyData);
    }
    const actor = Actor_1.default.newInstance();
    actor.setMapper(mapper);
    actor.getProperty().setColor(color[0] / 255, color[1] / 255, color[2] / 255);
    viewport.addActor({
        actor,
        uid: actorUID,
        clippingFilter,
    });
    element.addEventListener(core_1.Enums.Events.CLIPPING_PLANES_UPDATED, updateSurfacePlanes);
}
function updateSurfacePlanes(evt) {
    const { actorEntry, vtkPlanes, viewport } = evt.detail;
    if (!(actorEntry === null || actorEntry === void 0 ? void 0 : actorEntry.clippingFilter)) {
        return;
    }
    const mapper = actorEntry.actor.getMapper();
    const { viewPlaneNormal } = viewport.getCamera();
    const imageIndex = viewport.getCurrentImageIdIndex();
    const cacheId = `${viewport.id}-${(0, pointToString_1.pointToString)(viewPlaneNormal)}-${imageIndex}`;
    let actorCache = polyDataCache.get(actorEntry.uid);
    if (!actorCache) {
        actorCache = new Map();
        polyDataCache.set(actorEntry.uid, actorCache);
    }
    let polyData = actorCache.get(cacheId);
    if (!polyData) {
        const clippingFilter = actorEntry.clippingFilter;
        clippingFilter.setClippingPlanes(vtkPlanes);
        try {
            clippingFilter.update();
            polyData = clippingFilter.getOutputData();
            actorCache.set(cacheId, polyData);
        }
        catch (e) {
            console.error('Error clipping surface', e);
        }
    }
    mapper.setInputData(polyData);
}
exports.default = addSurfaceToElement;
//# sourceMappingURL=addSurfaceToElement.js.map