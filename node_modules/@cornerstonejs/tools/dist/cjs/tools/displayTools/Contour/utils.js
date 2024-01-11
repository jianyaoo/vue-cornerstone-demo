"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolyData = exports.validateGeometry = exports.getSegmentSpecificConfig = void 0;
const core_1 = require("@cornerstonejs/core");
const CellArray_1 = __importDefault(require("@kitware/vtk.js/Common/Core/CellArray"));
const Points_1 = __importDefault(require("@kitware/vtk.js/Common/Core/Points"));
const PolyData_1 = __importDefault(require("@kitware/vtk.js/Common/DataModel/PolyData"));
function getSegmentSpecificConfig(contourRepresentation, segmentId, index) {
    var _a, _b;
    let segmentSpecificConfig = (_a = contourRepresentation.segmentSpecificConfig) === null || _a === void 0 ? void 0 : _a[segmentId];
    if (!segmentSpecificConfig) {
        segmentSpecificConfig =
            (_b = contourRepresentation.segmentSpecificConfig) === null || _b === void 0 ? void 0 : _b[index];
    }
    if (!segmentSpecificConfig) {
        return null;
    }
    return segmentSpecificConfig.CONTOUR;
}
exports.getSegmentSpecificConfig = getSegmentSpecificConfig;
function validateGeometry(geometry) {
    if (!geometry) {
        throw new Error(`No contours found for geometryId ${geometry.id}`);
    }
    const geometryId = geometry.id;
    if (geometry.type !== core_1.Enums.GeometryType.CONTOUR) {
        throw new Error(`Geometry type ${geometry.type} not supported for rendering.`);
    }
    if (!geometry.data) {
        console.warn(`No contours found for geometryId ${geometryId}. Skipping render.`);
        return;
    }
}
exports.validateGeometry = validateGeometry;
function getPolyData(contourSet) {
    const pointArray = [];
    const points = Points_1.default.newInstance();
    const lines = CellArray_1.default.newInstance();
    let pointIndex = 0;
    contourSet.getContours().forEach((contour) => {
        const pointList = contour.getPoints();
        const flatPoints = contour.getFlatPointsArray();
        const type = contour.getType();
        const pointIndexes = pointList.map((_, pointListIndex) => pointListIndex + pointIndex);
        if (type === core_1.Enums.ContourType.CLOSED_PLANAR) {
            pointIndexes.push(pointIndexes[0]);
        }
        const linePoints = Float32Array.from(flatPoints);
        pointArray.push(...linePoints);
        lines.insertNextCell([...pointIndexes]);
        pointIndex = pointIndex + pointList.length;
    });
    points.setData(pointArray, 3);
    const polygon = PolyData_1.default.newInstance();
    polygon.setPoints(points);
    polygon.setLines(lines);
    return polygon;
}
exports.getPolyData = getPolyData;
//# sourceMappingURL=utils.js.map