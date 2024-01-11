import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder';
import getVolumeActorCorners from './getVolumeActorCorners';
import { EPSILON } from '../constants';
const SMALL_EPSILON = EPSILON * EPSILON;
const isOne = (v) => Math.abs(Math.abs(v) - 1) < SMALL_EPSILON;
const isUnit = (v, off) => isOne(v[off]) || isOne(v[off + 1]) || isOne(v[off + 2]);
const isOrthonormal = (v) => isUnit(v, 0) && isUnit(v, 3) && isUnit(v, 6);
export default function getSliceRange(volumeActor, viewPlaneNormal, focalPoint) {
    const imageData = volumeActor.getMapper().getInputData();
    let corners;
    const direction = imageData.getDirection();
    if (isOrthonormal(direction)) {
        corners = getVolumeActorCorners(volumeActor);
    }
    else {
        const [dx, dy, dz] = imageData.getDimensions();
        const cornersIdx = [
            [0, 0, 0],
            [dx - 1, 0, 0],
            [0, dy - 1, 0],
            [dx - 1, dy - 1, 0],
            [0, 0, dz - 1],
            [dx - 1, 0, dz - 1],
            [0, dy - 1, dz - 1],
            [dx - 1, dy - 1, dz - 1],
        ];
        corners = cornersIdx.map((it) => imageData.indexToWorld(it));
    }
    const transform = vtkMatrixBuilder
        .buildFromDegree()
        .identity()
        .rotateFromDirections(viewPlaneNormal, [1, 0, 0]);
    corners.forEach((pt) => transform.apply(pt));
    const transformedFocalPoint = [...focalPoint];
    transform.apply(transformedFocalPoint);
    const currentSlice = transformedFocalPoint[0];
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < 8; i++) {
        const x = corners[i][0];
        if (x > maxX) {
            maxX = x;
        }
        if (x < minX) {
            minX = x;
        }
    }
    return {
        min: minX,
        max: maxX,
        current: currentSlice,
        actor: volumeActor,
        viewPlaneNormal,
        focalPoint,
    };
}
//# sourceMappingURL=getSliceRange.js.map