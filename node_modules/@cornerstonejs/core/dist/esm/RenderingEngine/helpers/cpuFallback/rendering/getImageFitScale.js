import { validateParameterUndefinedOrNull } from './validator';
import getImageSize from './getImageSize';
export default function (canvas, image, rotation = null) {
    validateParameterUndefinedOrNull(canvas, 'getImageScale: parameter canvas must not be undefined');
    validateParameterUndefinedOrNull(image, 'getImageScale: parameter image must not be undefined');
    const imageSize = getImageSize(image, rotation);
    const rowPixelSpacing = image.rowPixelSpacing || 1;
    const columnPixelSpacing = image.columnPixelSpacing || 1;
    let verticalRatio = 1;
    let horizontalRatio = 1;
    if (rowPixelSpacing < columnPixelSpacing) {
        horizontalRatio = columnPixelSpacing / rowPixelSpacing;
    }
    else {
        verticalRatio = rowPixelSpacing / columnPixelSpacing;
    }
    const verticalScale = canvas.height / imageSize.height / verticalRatio;
    const horizontalScale = canvas.width / imageSize.width / horizontalRatio;
    return {
        verticalScale,
        horizontalScale,
        scaleFactor: Math.min(horizontalScale, verticalScale),
    };
}
//# sourceMappingURL=getImageFitScale.js.map