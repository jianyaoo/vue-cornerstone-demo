"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformIJKToCanvas = void 0;
const transformIndexToWorld_1 = __importDefault(require("./transformIndexToWorld"));
function transformIJKToCanvas(viewport, ijkPoint) {
    const { imageData: vtkImageData } = viewport.getImageData();
    const worldPoint = (0, transformIndexToWorld_1.default)(vtkImageData, ijkPoint);
    return viewport.worldToCanvas(worldPoint);
}
exports.transformIJKToCanvas = transformIJKToCanvas;
//# sourceMappingURL=transformIJKToCanvas.js.map