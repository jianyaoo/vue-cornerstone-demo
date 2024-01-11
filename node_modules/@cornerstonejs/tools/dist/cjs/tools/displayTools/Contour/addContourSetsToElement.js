"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContourSetsToElement = void 0;
const core_1 = require("@cornerstonejs/core");
const DataArray_1 = __importDefault(require("@kitware/vtk.js/Common/Core/DataArray"));
const AppendPolyData_1 = __importDefault(require("@kitware/vtk.js/Filters/General/AppendPolyData"));
const Actor_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Actor"));
const Mapper_1 = __importDefault(require("@kitware/vtk.js/Rendering/Core/Mapper"));
const utils_1 = require("./utils");
const contourConfigCache_1 = require("./contourConfigCache");
function addContourSetsToElement(viewport, geometryIds, contourRepresentation, contourRepresentationConfig, contourActorUID) {
    const { segmentationRepresentationUID, segmentsHidden } = contourRepresentation;
    const appendPolyData = AppendPolyData_1.default.newInstance();
    const scalarToColorMap = new Map();
    const segmentSpecificMap = new Map();
    geometryIds.forEach((geometryId) => {
        const geometry = core_1.cache.getGeometry(geometryId);
        if (!geometry) {
            console.warn(`No geometry found for geometryId ${geometryId}. Skipping render.`);
            return;
        }
        const segmentIndex = geometry.data.getSegmentIndex();
        (0, utils_1.validateGeometry)(geometry);
        const segmentSpecificConfig = (0, utils_1.getSegmentSpecificConfig)(contourRepresentation, geometryId, segmentIndex);
        const contourSet = geometry.data;
        const polyData = (0, utils_1.getPolyData)(contourSet);
        const color = contourSet.getColor();
        const size = polyData.getPoints().getNumberOfPoints();
        const scalars = DataArray_1.default.newInstance({
            size: size * 4,
            numberOfComponents: 4,
            dataType: 'Uint8Array',
        });
        for (let i = 0; i < size; ++i) {
            scalars.setTuple(i, [...color, 255]);
        }
        polyData.getPointData().setScalars(scalars);
        if (segmentSpecificConfig) {
            segmentSpecificMap.set(segmentIndex, segmentSpecificConfig);
        }
        scalarToColorMap.set(segmentIndex, [
            ...color,
            segmentsHidden.has(segmentIndex) ? 0 : 255,
        ]);
        segmentIndex === 0
            ? appendPolyData.setInputData(polyData)
            : appendPolyData.addInputData(polyData);
    });
    const polyDataOutput = appendPolyData.getOutputData();
    const outlineWidthActive = contourRepresentationConfig.representations.CONTOUR.outlineWidthActive;
    const mapper = Mapper_1.default.newInstance();
    mapper.setInputData(polyDataOutput);
    const actor = Actor_1.default.newInstance();
    actor.setMapper(mapper);
    actor.getProperty().setLineWidth(outlineWidthActive);
    (0, contourConfigCache_1.setConfigCache)(segmentationRepresentationUID, Object.assign({}, (0, contourConfigCache_1.getConfigCache)(segmentationRepresentationUID), {
        segmentsHidden: new Set(segmentsHidden),
        segmentSpecificMap,
        outlineWidthActive,
    }));
    actor.setForceOpaque(true);
    viewport.addActor({
        uid: contourActorUID,
        actor: actor,
    });
    viewport.resetCamera();
    viewport.render();
}
exports.addContourSetsToElement = addContourSetsToElement;
//# sourceMappingURL=addContourSetsToElement.js.map