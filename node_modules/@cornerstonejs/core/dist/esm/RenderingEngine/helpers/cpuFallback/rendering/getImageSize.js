import { validateParameterUndefinedOrNull } from './validator';
function isRotated(rotation) {
    return !(rotation === null ||
        rotation === undefined ||
        rotation === 0 ||
        rotation === 180);
}
export default function (image, rotation = null) {
    validateParameterUndefinedOrNull(image, 'getImageSize: parameter image must not be undefined');
    validateParameterUndefinedOrNull(image.width, 'getImageSize: parameter image must have width');
    validateParameterUndefinedOrNull(image.height, 'getImageSize: parameter image must have height');
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
//# sourceMappingURL=getImageSize.js.map