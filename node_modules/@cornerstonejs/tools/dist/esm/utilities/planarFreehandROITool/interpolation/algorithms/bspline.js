import { interpolateBasis as d3InterpolateBasis, quantize as d3Quantize, } from 'd3-interpolate';
import { zip as d3Zip } from 'd3-array';
function isPoints3D(points) {
    return points[0]?.length === 3;
}
export function interpolatePoints(originalPoints, knotsIndexes) {
    if (!knotsIndexes ||
        knotsIndexes.length === 0 ||
        knotsIndexes.length === originalPoints.length) {
        return originalPoints;
    }
    const n = knotsIndexes[knotsIndexes.length - 1] - knotsIndexes[0] + 1;
    const xInterpolator = d3InterpolateBasis(knotsIndexes.map((k) => originalPoints[k][0]));
    const yInterpolator = d3InterpolateBasis(knotsIndexes.map((k) => originalPoints[k][1]));
    if (isPoints3D(originalPoints)) {
        const zInterpolator = d3InterpolateBasis(knotsIndexes.map((k) => originalPoints[k][2]));
        return (d3Zip(d3Quantize(xInterpolator, n), d3Quantize(yInterpolator, n), d3Quantize(zInterpolator, n)));
    }
    else {
        return (d3Zip(d3Quantize(xInterpolator, n), d3Quantize(yInterpolator, n)));
    }
}
//# sourceMappingURL=bspline.js.map