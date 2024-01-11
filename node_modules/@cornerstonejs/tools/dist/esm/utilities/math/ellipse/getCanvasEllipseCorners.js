export default function getCanvasEllipseCorners(ellipseCanvasPoints) {
    const [bottom, top, left, right] = ellipseCanvasPoints;
    const topLeft = [left[0], top[1]];
    const bottomRight = [right[0], bottom[1]];
    return [topLeft, bottomRight];
}
//# sourceMappingURL=getCanvasEllipseCorners.js.map