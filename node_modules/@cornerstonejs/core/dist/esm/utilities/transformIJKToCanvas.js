import transformIndexToWorld from './transformIndexToWorld';
export function transformIJKToCanvas(viewport, ijkPoint) {
    const { imageData: vtkImageData } = viewport.getImageData();
    const worldPoint = transformIndexToWorld(vtkImageData, ijkPoint);
    return viewport.worldToCanvas(worldPoint);
}
//# sourceMappingURL=transformIJKToCanvas.js.map