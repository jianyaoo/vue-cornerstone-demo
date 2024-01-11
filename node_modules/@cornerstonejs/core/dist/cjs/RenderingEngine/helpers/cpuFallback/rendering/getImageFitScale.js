"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
const getImageSize_1 = __importDefault(require("./getImageSize"));
function default_1(canvas, image, rotation = null) {
    (0, validator_1.validateParameterUndefinedOrNull)(canvas, 'getImageScale: parameter canvas must not be undefined');
    (0, validator_1.validateParameterUndefinedOrNull)(image, 'getImageScale: parameter image must not be undefined');
    const imageSize = (0, getImageSize_1.default)(image, rotation);
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
exports.default = default_1;
//# sourceMappingURL=getImageFitScale.js.map