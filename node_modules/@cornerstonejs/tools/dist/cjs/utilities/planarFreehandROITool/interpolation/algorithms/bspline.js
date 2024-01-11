"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpolatePoints = void 0;
const d3_interpolate_1 = require("d3-interpolate");
const d3_array_1 = require("d3-array");
function isPoints3D(points) {
    var _a;
    return ((_a = points[0]) === null || _a === void 0 ? void 0 : _a.length) === 3;
}
function interpolatePoints(originalPoints, knotsIndexes) {
    if (!knotsIndexes ||
        knotsIndexes.length === 0 ||
        knotsIndexes.length === originalPoints.length) {
        return originalPoints;
    }
    const n = knotsIndexes[knotsIndexes.length - 1] - knotsIndexes[0] + 1;
    const xInterpolator = (0, d3_interpolate_1.interpolateBasis)(knotsIndexes.map((k) => originalPoints[k][0]));
    const yInterpolator = (0, d3_interpolate_1.interpolateBasis)(knotsIndexes.map((k) => originalPoints[k][1]));
    if (isPoints3D(originalPoints)) {
        const zInterpolator = (0, d3_interpolate_1.interpolateBasis)(knotsIndexes.map((k) => originalPoints[k][2]));
        return ((0, d3_array_1.zip)((0, d3_interpolate_1.quantize)(xInterpolator, n), (0, d3_interpolate_1.quantize)(yInterpolator, n), (0, d3_interpolate_1.quantize)(zInterpolator, n)));
    }
    else {
        return ((0, d3_array_1.zip)((0, d3_interpolate_1.quantize)(xInterpolator, n), (0, d3_interpolate_1.quantize)(yInterpolator, n)));
    }
}
exports.interpolatePoints = interpolatePoints;
//# sourceMappingURL=bspline.js.map