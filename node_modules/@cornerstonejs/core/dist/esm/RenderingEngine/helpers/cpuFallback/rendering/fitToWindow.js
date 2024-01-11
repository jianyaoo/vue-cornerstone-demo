import getImageFitScale from './getImageFitScale';
export default function (enabledElement) {
    const { image } = enabledElement;
    enabledElement.viewport.scale = getImageFitScale(enabledElement.canvas, image, enabledElement.viewport.rotation).scaleFactor;
    enabledElement.viewport.translation.x = 0;
    enabledElement.viewport.translation.y = 0;
}
//# sourceMappingURL=fitToWindow.js.map