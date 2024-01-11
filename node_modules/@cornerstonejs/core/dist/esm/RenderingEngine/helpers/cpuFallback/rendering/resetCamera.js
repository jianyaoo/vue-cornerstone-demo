import getImageFitScale from './getImageFitScale';
export default function (enabledElement, resetPan = true, resetZoom = true) {
    const { canvas, image, viewport } = enabledElement;
    const scale = getImageFitScale(canvas, image, 0).scaleFactor;
    viewport.vflip = false;
    viewport.hflip = false;
    if (resetPan) {
        viewport.translation.x = 0;
        viewport.translation.y = 0;
    }
    if (resetZoom) {
        viewport.displayedArea.tlhc.x = 1;
        viewport.displayedArea.tlhc.y = 1;
        viewport.displayedArea.brhc.x = image.columns;
        viewport.displayedArea.brhc.y = image.rows;
        viewport.scale = scale;
    }
}
//# sourceMappingURL=resetCamera.js.map