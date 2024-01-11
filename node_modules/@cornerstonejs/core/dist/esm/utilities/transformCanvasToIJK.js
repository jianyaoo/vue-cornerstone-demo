import transformWorldToIndex from './transformWorldToIndex';
export function transformCanvasToIJK(viewport, canvasPoint) {
    const { imageData: vtkImageData } = viewport.getImageData();
    const worldPoint = viewport.canvasToWorld(canvasPoint);
    return transformWorldToIndex(vtkImageData, worldPoint);
}
//# sourceMappingURL=transformCanvasToIJK.js.map