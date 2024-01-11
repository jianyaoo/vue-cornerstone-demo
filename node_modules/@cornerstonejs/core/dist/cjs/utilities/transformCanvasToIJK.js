"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformCanvasToIJK = void 0;
const transformWorldToIndex_1 = __importDefault(require("./transformWorldToIndex"));
function transformCanvasToIJK(viewport, canvasPoint) {
    const { imageData: vtkImageData } = viewport.getImageData();
    const worldPoint = viewport.canvasToWorld(canvasPoint);
    return (0, transformWorldToIndex_1.default)(vtkImageData, worldPoint);
}
exports.transformCanvasToIJK = transformCanvasToIJK;
//# sourceMappingURL=transformCanvasToIJK.js.map