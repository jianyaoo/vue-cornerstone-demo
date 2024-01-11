export default function (shift, viewportOrientation) {
    const { hflip, vflip, rotation } = viewportOrientation;
    shift.x *= hflip ? -1 : 1;
    shift.y *= vflip ? -1 : 1;
    if (rotation !== 0) {
        const angle = (rotation * Math.PI) / 180;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const newX = shift.x * cosA - shift.y * sinA;
        const newY = shift.x * sinA + shift.y * cosA;
        shift.x = newX;
        shift.y = newY;
    }
    return shift;
}
//# sourceMappingURL=correctShift.js.map