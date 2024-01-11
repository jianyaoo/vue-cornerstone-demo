import getTransform from './getTransform';
export default function (enabledElement, pt) {
    const transform = getTransform(enabledElement);
    transform.invert();
    return transform.transformPoint(pt);
}
//# sourceMappingURL=canvasToPixel.js.map