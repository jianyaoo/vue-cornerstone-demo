"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@cornerstonejs/core");
const gl_matrix_1 = require("gl-matrix");
const addCanvasPointsToArray = (element, canvasPoints, newCanvasPoint, commonData) => {
    const { xDir, yDir, spacing } = commonData;
    const enabledElement = (0, core_1.getEnabledElement)(element);
    const { viewport } = enabledElement;
    const lastWorldPos = viewport.canvasToWorld(canvasPoints[canvasPoints.length - 1]);
    const newWorldPos = viewport.canvasToWorld(newCanvasPoint);
    const worldPosDiff = gl_matrix_1.vec3.create();
    gl_matrix_1.vec3.subtract(worldPosDiff, newWorldPos, lastWorldPos);
    const xDist = Math.abs(gl_matrix_1.vec3.dot(worldPosDiff, xDir));
    const yDist = Math.abs(gl_matrix_1.vec3.dot(worldPosDiff, yDir));
    const numPointsToAdd = Math.max(Math.floor(xDist / spacing[0]), Math.floor(yDist / spacing[0]));
    if (numPointsToAdd > 1) {
        const lastCanvasPoint = canvasPoints[canvasPoints.length - 1];
        const canvasDist = gl_matrix_1.vec2.dist(lastCanvasPoint, newCanvasPoint);
        const canvasDir = gl_matrix_1.vec2.create();
        gl_matrix_1.vec2.subtract(canvasDir, newCanvasPoint, lastCanvasPoint);
        gl_matrix_1.vec2.set(canvasDir, canvasDir[0] / canvasDist, canvasDir[1] / canvasDist);
        const distPerPoint = canvasDist / numPointsToAdd;
        for (let i = 1; i <= numPointsToAdd; i++) {
            canvasPoints.push([
                lastCanvasPoint[0] + distPerPoint * canvasDir[0] * i,
                lastCanvasPoint[1] + distPerPoint * canvasDir[1] * i,
            ]);
        }
    }
    else {
        canvasPoints.push(newCanvasPoint);
    }
    return numPointsToAdd;
};
exports.default = addCanvasPointsToArray;
//# sourceMappingURL=addCanvasPointsToArray.js.map