import vtkMath from '@kitware/vtk.js/Common/Core/Math';
import { utilities as csUtils } from '@cornerstonejs/core';
export default function getPointInLineOfSightWithCriteria(viewport, worldPos, targetVolumeId, criteriaFunction, stepSize = 0.25) {
    const camera = viewport.getCamera();
    const { position: cameraPosition } = camera;
    const { spacingInNormalDirection } = csUtils.getTargetVolumeAndSpacingInNormalDir(viewport, camera, targetVolumeId);
    const step = spacingInNormalDirection * stepSize;
    const bounds = viewport.getBounds();
    const xMin = bounds[0];
    const xMax = bounds[1];
    const vector = [0, 0, 0];
    let point = [0, 0, 0];
    vtkMath.subtract(worldPos, cameraPosition, vector);
    let pickedPoint;
    for (let pointT = xMin; pointT <= xMax; pointT = pointT + step) {
        point = [pointT, 0, 0];
        const t = (pointT - cameraPosition[0]) / vector[0];
        point[1] = t * vector[1] + cameraPosition[1];
        point[2] = t * vector[2] + cameraPosition[2];
        if (_inBounds(point, bounds)) {
            const intensity = viewport.getIntensityFromWorld(point);
            const pointToPick = criteriaFunction(intensity, point);
            if (pointToPick) {
                pickedPoint = pointToPick;
            }
        }
    }
    return pickedPoint;
}
const _inBounds = function (point, bounds) {
    const [xMin, xMax, yMin, yMax, zMin, zMax] = bounds;
    return (point[0] > xMin &&
        point[0] < xMax &&
        point[1] > yMin &&
        point[1] < yMax &&
        point[2] > zMin &&
        point[2] < zMax);
};
//# sourceMappingURL=getPointInLineOfSightWithCriteria.js.map