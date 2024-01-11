"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transform_1 = require("./transform");
function default_1(enabledElement, scale) {
    const transform = new transform_1.Transform();
    if (!enabledElement.viewport.displayedArea) {
        return transform;
    }
    transform.translate(enabledElement.canvas.width / 2, enabledElement.canvas.height / 2);
    const angle = enabledElement.viewport.rotation;
    if (angle !== 0) {
        transform.rotate((angle * Math.PI) / 180);
    }
    let widthScale = enabledElement.viewport.scale;
    let heightScale = enabledElement.viewport.scale;
    const width = enabledElement.viewport.displayedArea.brhc.x -
        (enabledElement.viewport.displayedArea.tlhc.x - 1);
    const height = enabledElement.viewport.displayedArea.brhc.y -
        (enabledElement.viewport.displayedArea.tlhc.y - 1);
    if (enabledElement.viewport.displayedArea.presentationSizeMode === 'NONE') {
        if (enabledElement.image.rowPixelSpacing <
            enabledElement.image.columnPixelSpacing) {
            widthScale *=
                enabledElement.image.columnPixelSpacing /
                    enabledElement.image.rowPixelSpacing;
        }
        else if (enabledElement.image.columnPixelSpacing <
            enabledElement.image.rowPixelSpacing) {
            heightScale *=
                enabledElement.image.rowPixelSpacing /
                    enabledElement.image.columnPixelSpacing;
        }
    }
    else {
        widthScale = enabledElement.viewport.displayedArea.columnPixelSpacing;
        heightScale = enabledElement.viewport.displayedArea.rowPixelSpacing;
        if (enabledElement.viewport.displayedArea.presentationSizeMode ===
            'SCALE TO FIT') {
            const verticalScale = enabledElement.canvas.height / (height * heightScale);
            const horizontalScale = enabledElement.canvas.width / (width * widthScale);
            widthScale = heightScale = Math.min(horizontalScale, verticalScale);
            if (enabledElement.viewport.displayedArea.rowPixelSpacing <
                enabledElement.viewport.displayedArea.columnPixelSpacing) {
                widthScale *=
                    enabledElement.viewport.displayedArea.columnPixelSpacing /
                        enabledElement.viewport.displayedArea.rowPixelSpacing;
            }
            else if (enabledElement.viewport.displayedArea.columnPixelSpacing <
                enabledElement.viewport.displayedArea.rowPixelSpacing) {
                heightScale *=
                    enabledElement.viewport.displayedArea.rowPixelSpacing /
                        enabledElement.viewport.displayedArea.columnPixelSpacing;
            }
        }
    }
    transform.scale(widthScale, heightScale);
    if (angle !== 0) {
        transform.rotate((-angle * Math.PI) / 180);
    }
    transform.translate(enabledElement.viewport.translation.x, enabledElement.viewport.translation.y);
    if (angle !== 0) {
        transform.rotate((angle * Math.PI) / 180);
    }
    if (scale !== undefined) {
        transform.scale(scale, scale);
    }
    if (enabledElement.viewport.hflip) {
        transform.scale(-1, 1);
    }
    if (enabledElement.viewport.vflip) {
        transform.scale(1, -1);
    }
    transform.translate(-width / 2, -height / 2);
    return transform;
}
exports.default = default_1;
//# sourceMappingURL=calculateTransform.js.map