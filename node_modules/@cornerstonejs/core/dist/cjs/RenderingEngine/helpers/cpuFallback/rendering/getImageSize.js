"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
function isRotated(rotation) {
    return !(rotation === null ||
        rotation === undefined ||
        rotation === 0 ||
        rotation === 180);
}
function default_1(image, rotation = null) {
    (0, validator_1.validateParameterUndefinedOrNull)(image, 'getImageSize: parameter image must not be undefined');
    (0, validator_1.validateParameterUndefinedOrNull)(image.width, 'getImageSize: parameter image must have width');
    (0, validator_1.validateParameterUndefinedOrNull)(image.height, 'getImageSize: parameter image must have height');
    if (isRotated(rotation)) {
        return {
            height: image.width,
            width: image.height,
        };
    }
    return {
        width: image.width,
        height: image.height,
    };
}
exports.default = default_1;
//# sourceMappingURL=getImageSize.js.map