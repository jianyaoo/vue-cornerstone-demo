import calculateTransform from './calculateTransform';
export default function (enabledElement, context, scale) {
    if (enabledElement === undefined) {
        throw new Error('setToPixelCoordinateSystem: parameter enabledElement must not be undefined');
    }
    if (context === undefined) {
        throw new Error('setToPixelCoordinateSystem: parameter context must not be undefined');
    }
    const transform = calculateTransform(enabledElement, scale);
    const m = transform.getMatrix();
    context.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
}
//# sourceMappingURL=setToPixelCoordinateSystem.js.map