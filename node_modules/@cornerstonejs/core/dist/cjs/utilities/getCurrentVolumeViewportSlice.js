"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentVolumeViewportSlice = exports.default = void 0;
const gl_matrix_1 = require("gl-matrix");
const transformIJKToCanvas_1 = require("./transformIJKToCanvas");
const transformCanvasToIJK_1 = require("./transformCanvasToIJK");
function getCurrentVolumeViewportSlice(viewport) {
    const { dimensions, scalarData } = viewport.getImageData();
    const { width: canvasWidth, height: canvasHeight } = viewport.getCanvas();
    const ijkOriginPoint = (0, transformCanvasToIJK_1.transformCanvasToIJK)(viewport, [0, 0]);
    const ijkRowPoint = (0, transformCanvasToIJK_1.transformCanvasToIJK)(viewport, [canvasWidth - 1, 0]);
    const ijkColPoint = (0, transformCanvasToIJK_1.transformCanvasToIJK)(viewport, [0, canvasHeight - 1]);
    const ijkRowVec = gl_matrix_1.vec3.sub(gl_matrix_1.vec3.create(), ijkRowPoint, ijkOriginPoint);
    const ijkColVec = gl_matrix_1.vec3.sub(gl_matrix_1.vec3.create(), ijkColPoint, ijkOriginPoint);
    const ijkSliceVec = gl_matrix_1.vec3.cross(gl_matrix_1.vec3.create(), ijkRowVec, ijkColVec);
    gl_matrix_1.vec3.normalize(ijkRowVec, ijkRowVec);
    gl_matrix_1.vec3.normalize(ijkColVec, ijkColVec);
    gl_matrix_1.vec3.normalize(ijkSliceVec, ijkSliceVec);
    const maxIJKRowVec = Math.max(Math.abs(ijkRowVec[0]), Math.abs(ijkRowVec[1]), Math.abs(ijkRowVec[2]));
    const maxIJKColVec = Math.max(Math.abs(ijkColVec[0]), Math.abs(ijkColVec[1]), Math.abs(ijkColVec[2]));
    if (!gl_matrix_1.glMatrix.equals(1, maxIJKRowVec) || !gl_matrix_1.glMatrix.equals(1, maxIJKColVec)) {
        throw new Error('Livewire is not available for rotate/oblique viewports');
    }
    const [sx, sy, sz] = dimensions;
    const ijkCorners = [
        [0, 0, 0],
        [sx - 1, 0, 0],
        [0, sy - 1, 0],
        [sx - 1, sy - 1, 0],
        [0, 0, sz - 1],
        [sx - 1, 0, sz - 1],
        [0, sy - 1, sz - 1],
        [sx - 1, sy - 1, sz - 1],
    ];
    const canvasCorners = ijkCorners.map((ijkCorner) => (0, transformIJKToCanvas_1.transformIJKToCanvas)(viewport, ijkCorner));
    const canvasAABB = canvasCorners.reduce((aabb, canvasPoint) => {
        aabb.minX = Math.min(aabb.minX, canvasPoint[0]);
        aabb.minY = Math.min(aabb.minY, canvasPoint[1]);
        aabb.maxX = Math.max(aabb.maxX, canvasPoint[0]);
        aabb.maxY = Math.max(aabb.maxY, canvasPoint[1]);
        return aabb;
    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    const ijkTopLeft = (0, transformCanvasToIJK_1.transformCanvasToIJK)(viewport, [
        canvasAABB.minX,
        canvasAABB.minY,
    ]);
    const ijkBottomRight = (0, transformCanvasToIJK_1.transformCanvasToIJK)(viewport, [
        canvasAABB.maxX,
        canvasAABB.maxY,
    ]);
    const ijkDiagonal = gl_matrix_1.vec3.sub(gl_matrix_1.vec3.create(), ijkBottomRight, ijkTopLeft);
    const sliceToIndexMatrix = gl_matrix_1.mat4.fromValues(ijkRowVec[0], ijkRowVec[1], ijkRowVec[2], 0, ijkColVec[0], ijkColVec[1], ijkColVec[2], 0, ijkSliceVec[0], ijkSliceVec[1], ijkSliceVec[2], 0, ijkTopLeft[0], ijkTopLeft[1], ijkTopLeft[2], 1);
    const indexToSliceMatrix = gl_matrix_1.mat4.invert(gl_matrix_1.mat4.create(), sliceToIndexMatrix);
    const sliceWidth = gl_matrix_1.vec3.dot(ijkRowVec, ijkDiagonal) + 1;
    const sliceHeight = gl_matrix_1.vec3.dot(ijkColVec, ijkDiagonal) + 1;
    const TypedArray = scalarData.constructor;
    const sliceData = new TypedArray(sliceWidth * sliceHeight);
    const pixelsPerSlice = dimensions[0] * dimensions[1];
    const ijkPixelRow = gl_matrix_1.vec3.clone(ijkTopLeft);
    const ijkPixelCol = gl_matrix_1.vec3.create();
    let slicePixelIndex = 0;
    for (let y = 0; y < sliceHeight; y++) {
        gl_matrix_1.vec3.copy(ijkPixelCol, ijkPixelRow);
        for (let x = 0; x < sliceWidth; x++) {
            const volumePixelIndex = ijkPixelCol[2] * pixelsPerSlice +
                ijkPixelCol[1] * dimensions[0] +
                ijkPixelCol[0];
            if (volumePixelIndex < scalarData.length) {
                sliceData[slicePixelIndex] = scalarData[volumePixelIndex];
            }
            slicePixelIndex++;
            gl_matrix_1.vec3.add(ijkPixelCol, ijkPixelCol, ijkRowVec);
        }
        gl_matrix_1.vec3.add(ijkPixelRow, ijkPixelRow, ijkColVec);
    }
    return {
        width: sliceWidth,
        height: sliceHeight,
        scalarData: sliceData,
        sliceToIndexMatrix,
        indexToSliceMatrix,
    };
}
exports.default = getCurrentVolumeViewportSlice;
exports.getCurrentVolumeViewportSlice = getCurrentVolumeViewportSlice;
//# sourceMappingURL=getCurrentVolumeViewportSlice.js.map