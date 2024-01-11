import getTransform from './getTransform';
export default function (enabledElement, pt) {
    const transform = getTransform(enabledElement);
    return transform.transformPoint(pt);
}
//# sourceMappingURL=pixelToCanvas.js.map