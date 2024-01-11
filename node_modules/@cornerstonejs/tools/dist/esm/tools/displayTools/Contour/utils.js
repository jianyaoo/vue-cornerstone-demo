import { Enums } from '@cornerstonejs/core';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
export function getSegmentSpecificConfig(contourRepresentation, segmentId, index) {
    let segmentSpecificConfig = contourRepresentation.segmentSpecificConfig?.[segmentId];
    if (!segmentSpecificConfig) {
        segmentSpecificConfig =
            contourRepresentation.segmentSpecificConfig?.[index];
    }
    if (!segmentSpecificConfig) {
        return null;
    }
    return segmentSpecificConfig.CONTOUR;
}
export function validateGeometry(geometry) {
    if (!geometry) {
        throw new Error(`No contours found for geometryId ${geometry.id}`);
    }
    const geometryId = geometry.id;
    if (geometry.type !== Enums.GeometryType.CONTOUR) {
        throw new Error(`Geometry type ${geometry.type} not supported for rendering.`);
    }
    if (!geometry.data) {
        console.warn(`No contours found for geometryId ${geometryId}. Skipping render.`);
        return;
    }
}
export function getPolyData(contourSet) {
    const pointArray = [];
    const points = vtkPoints.newInstance();
    const lines = vtkCellArray.newInstance();
    let pointIndex = 0;
    contourSet.getContours().forEach((contour) => {
        const pointList = contour.getPoints();
        const flatPoints = contour.getFlatPointsArray();
        const type = contour.getType();
        const pointIndexes = pointList.map((_, pointListIndex) => pointListIndex + pointIndex);
        if (type === Enums.ContourType.CLOSED_PLANAR) {
            pointIndexes.push(pointIndexes[0]);
        }
        const linePoints = Float32Array.from(flatPoints);
        pointArray.push(...linePoints);
        lines.insertNextCell([...pointIndexes]);
        pointIndex = pointIndex + pointList.length;
    });
    points.setData(pointArray, 3);
    const polygon = vtkPolyData.newInstance();
    polygon.setPoints(points);
    polygon.setLines(lines);
    return polygon;
}
//# sourceMappingURL=utils.js.map